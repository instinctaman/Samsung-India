import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import Refresh from "@/assets/images/svg/Refresh cw.svg";
import Wifi from "@/assets/images/svg/Wifi.svg";
import LiveQuizIcon from "@/assets/images/svg/live_quiz.svg";
import CorrectImage from "@/assets/images/svg/correct.svg";
import WrongImage from "@/assets/images/svg/wrong.svg";
import TimeUpImage from "@/assets/images/svg/time_up.svg";
import WinImage from "@/assets/images/svg/win.svg";
import AppText from "@/components/ui/AppText";
import { quizQuestions } from "@/data/quiz";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { Fonts } from "@/theme/fonts";

const QUESTION_SECONDS = 24;
type QuestionState = "answering" | "correct" | "incorrect" | "timedOut";
type QuizView = "question" | "map" | "results";

const optionColors: Record<string, string> = {
  A: Colors.success,
  B: Colors.primary,
  C: "#E5B800",
  D: "#FF3B30",
};

export default function QuizScreen() {
  const router = useRouter();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [seconds, setSeconds] = useState(QUESTION_SECONDS);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [questionState, setQuestionState] = useState<QuestionState>("answering");
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [view, setView] = useState<QuizView>("question");

  const question = quizQuestions[questionIndex];
  const correctAnswers = useMemo(
    () => Object.entries(answers).reduce((count, [index, answer]) => count + Number(answer === quizQuestions[Number(index)]?.correctOptionId), 0),
    [answers],
  );

  useEffect(() => {
    if (view !== "question" || questionState !== "answering") return;
    if (seconds === 0) {
      setQuestionState(selectedOptionId ? (selectedOptionId === question.correctOptionId ? "correct" : "incorrect") : "timedOut");
      setAnswers((current) => ({ ...current, [questionIndex]: selectedOptionId }));
      return;
    }

    const countdown = setTimeout(() => setSeconds((current) => current - 1), 1000);
    return () => clearTimeout(countdown);
  }, [question, questionIndex, questionState, seconds, selectedOptionId, view]);

  const openQuestion = (index: number) => {
    const previousAnswer = answers[index];
    const wasCompleted = Object.prototype.hasOwnProperty.call(answers, index);
    setQuestionIndex(index);
    setSeconds(wasCompleted ? 0 : QUESTION_SECONDS);
    setSelectedOptionId(previousAnswer ?? null);
    setQuestionState(wasCompleted ? getQuestionState(index, previousAnswer) : "answering");
    setView("question");
  };

  const nextQuestion = () => {
    if (questionIndex + 1 === quizQuestions.length) {
      setView("results");
      return;
    }
    openQuestion(questionIndex + 1);
  };

  const resetQuiz = () => {
    setAnswers({});
    setQuestionIndex(0);
    setSeconds(QUESTION_SECONDS);
    setSelectedOptionId(null);
    setQuestionState("answering");
    setView("question");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <QuizHeader onReset={resetQuiz} />
      {view === "results" ? (
        <Results correctAnswers={correctAnswers} onContinue={() => router.replace({ pathname: "/session_detail", params: { attendance: "recorded", quiz: "completed" } })} />
      ) : view === "map" ? (
        <AssessmentMap answers={answers} currentIndex={questionIndex} onSelectQuestion={openQuestion} onBack={() => setView("question")} onSubmit={() => setView("results")} />
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {questionState === "answering" ? (
            <View style={styles.timer}><AppText style={styles.timerText} weight={FontWeight.medium}>{seconds}</AppText></View>
          ) : (
            <Feedback state={questionState} />
          )}
          <View style={styles.questionCard}>
            <AppText style={styles.questionNumber} color={Colors.primary}>Question {questionIndex + 1} of {quizQuestions.length}</AppText>
            <AppText style={styles.question} weight={FontWeight.medium}>{question.question}</AppText>
            <View style={styles.options}>
              {question.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                const isCorrect = option.id === question.correctOptionId;
                const revealAnswer = questionState !== "answering";
                const borderColor = revealAnswer && isCorrect ? Colors.success : revealAnswer && isSelected ? Colors.danger : "#D1D5DB";
                return <Pressable key={option.id} disabled={questionState !== "answering"} onPress={() => setSelectedOptionId(option.id)} style={[styles.option, { borderColor }, isSelected && questionState === "answering" && styles.selectedOption]}>
                  <View style={[styles.optionLetter, { backgroundColor: optionColors[option.id] ?? Colors.primary }]}><AppText style={styles.optionLetterText} color={Colors.white} weight={FontWeight.semiBold}>{option.id}</AppText></View>
                  <AppText style={styles.optionText}>{option.text}</AppText>
                  {revealAnswer && isCorrect && <AppText style={styles.correctLabel}>Correct Answer</AppText>}
                  {revealAnswer && isSelected && !isCorrect && <AppText style={styles.wrongLabel}>Your Answer</AppText>}
                </Pressable>;
              })}
            </View>
            {questionState !== "answering" && <View style={styles.explanation}><AppText weight={FontWeight.semiBold}>●  Explanation</AppText><AppText style={styles.explanationText}>{question.explanation}</AppText></View>}
            {questionState !== "answering" && <View style={styles.actions}><Pressable style={styles.secondaryButton} onPress={() => setView("map")}><AppText style={styles.secondaryButtonText}>Assessment Map</AppText></Pressable><Pressable style={styles.primaryButton} onPress={nextQuestion}><AppText color={Colors.white} weight={FontWeight.semiBold}>{questionIndex + 1 === quizQuestions.length ? "View Results" : "Next Question"}</AppText></Pressable></View>}
          </View>
          {questionState === "answering" && <Pressable style={styles.mapButton} onPress={() => setView("map")}><AppText style={styles.mapButtonText}>Open Assessment Map</AppText></Pressable>}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function getQuestionState(index: number, answer: string | null | undefined): QuestionState {
  if (!answer) return "timedOut";
  return answer === quizQuestions[index].correctOptionId ? "correct" : "incorrect";
}

function QuizHeader({ onReset }: { onReset: () => void }) {
  return <View style={styles.header}><View style={styles.liveName}><LiveQuizIcon width={13} height={13} /><AppText style={styles.liveTitle} color={Colors.white} weight={FontWeight.medium}>LIVE QUIZ</AppText></View><View style={styles.headerActions}><Pressable style={styles.headerButton} onPress={onReset}><Refresh width={11} height={11} /><AppText style={styles.headerButtonText} color={Colors.primary}>SYNC LIVE QUIZ</AppText></Pressable><Pressable style={styles.headerButton} onPress={onReset}><Refresh width={11} height={11} /><AppText style={styles.headerButtonText} color={Colors.primary}>REFRESH</AppText></Pressable><View style={styles.wifi}><Wifi width={13} height={13} /></View></View></View>;
}

function Feedback({ state }: { state: Exclude<QuestionState, "answering"> }) {
  const content = state === "correct" ? { Image: CorrectImage, title: "Correct!", subtitle: "Great job! You selected the right answer.", color: Colors.success } : state === "incorrect" ? { Image: WrongImage, title: "Incorrect!", subtitle: "Oops! That's not the right answer.", color: "#FF3B30" } : { Image: TimeUpImage, title: "Time’s Up!", subtitle: "Better luck next time! Keep practicing to improve your score.", color: "#FF3B30" };
  return <View style={styles.feedback}><content.Image width={state === "timedOut" ? 189 : 220} height={state === "timedOut" ? 88 : 77} /><AppText style={[styles.feedbackTitle, { color: content.color }]} weight={FontWeight.semiBold}>{content.title}</AppText><AppText style={styles.feedbackSubtitle}>{content.subtitle}</AppText></View>;
}

function Results({ correctAnswers, onContinue }: { correctAnswers: number; onContinue: () => void }) {
  const total = quizQuestions.length;
  const accuracy = Math.round((correctAnswers / total) * 100);
  return <ScrollView contentContainerStyle={styles.results} showsVerticalScrollIndicator={false}><WinImage width={260} height={86} /><AppText style={styles.resultsTitle} weight={FontWeight.semiBold}>Results</AppText><AppText style={styles.resultsSubtitle}>Great attempt! Keep going and improve your score.</AppText><View style={styles.scoreCard}><AppText style={styles.scoreLabel} color={Colors.white}>YOUR LIVE ACCURACY</AppText><AppText style={styles.scoreValue} color={Colors.white} weight={FontWeight.semiBold}>{accuracy}%</AppText><AppText style={styles.scoreDetail} color={Colors.white}>{correctAnswers} / {total} correct</AppText></View><View style={styles.summary}><AppText weight={FontWeight.semiBold}>PERFORMANCE SUMMARY</AppText><View style={styles.summaryRow}><Summary label="Correct" value={String(correctAnswers)} /><Summary label="Incorrect" value={String(total - correctAnswers)} /><Summary label="Accuracy" value={`${accuracy}%`} /></View></View><GlobalLeaderboard accuracy={accuracy} /><Pressable style={[styles.primaryButton, styles.continueButton]} onPress={onContinue}><AppText color={Colors.white} weight={FontWeight.semiBold}>Continue</AppText></Pressable></ScrollView>;
}

function Summary({ label, value }: { label: string; value: string }) { return <View style={styles.summaryItem}><AppText style={styles.summaryValue} weight={FontWeight.semiBold}>{value}</AppText><AppText style={styles.summaryLabel}>{label}</AppText></View>; }

function AssessmentMap({ answers, currentIndex, onSelectQuestion, onBack, onSubmit }: { answers: Record<number, string | null>; currentIndex: number; onSelectQuestion: (index: number) => void; onBack: () => void; onSubmit: () => void }) {
  return <ScrollView contentContainerStyle={styles.mapContent} showsVerticalScrollIndicator={false}><View style={styles.mapHero}><AppText style={styles.mapTitle} color={Colors.white} weight={FontWeight.semiBold}>Assessment Map</AppText><AppText style={styles.mapSubtitle} color={Colors.white}>Review your attempts before final submission</AppText></View><View style={styles.mapCard}><View style={styles.mapStats}><MapStat value={String(Object.keys(answers).length)} label="DONE" color={Colors.success} /><MapStat value={String(quizQuestions.length - Object.keys(answers).length)} label="SKIPPED" color="#E5B800" /><MapStat value={String(Object.values(answers).filter((answer) => answer === null).length)} label="EXPIRED" color={Colors.danger} /></View><View style={styles.legend}><AppText style={styles.legendText}>● Attempted</AppText><AppText style={[styles.legendText, { color: "#B87900" }]}>● Skipped</AppText><AppText style={[styles.legendText, { color: Colors.danger }]}>● Timed Out</AppText></View><View style={styles.questionGrid}>{quizQuestions.map((_, index) => { const completed = Object.prototype.hasOwnProperty.call(answers, index); const expired = completed && answers[index] === null; return <Pressable key={index} onPress={() => onSelectQuestion(index)} style={[styles.mapTile, completed && !expired && styles.attemptedTile, expired && styles.expiredTile, index === currentIndex && styles.currentTile]}><AppText style={[styles.mapTileText, (completed || expired) && { color: expired ? Colors.danger : "#07935C" }]} weight={FontWeight.semiBold}>{index + 1}</AppText></Pressable>; })}</View><Pressable style={styles.reviewButton} onPress={onBack}><AppText color={Colors.white} weight={FontWeight.semiBold}>Back to Current Question</AppText></Pressable><Pressable style={styles.submitButton} onPress={onSubmit}><AppText color={Colors.white} weight={FontWeight.semiBold}>Final Submit</AppText></Pressable></View></ScrollView>;
}

function MapStat({ value, label, color }: { value: string; label: string; color: string }) { return <View style={styles.mapStat}><AppText style={[styles.mapStatValue, { color }]} weight={FontWeight.semiBold}>{value}</AppText><AppText style={styles.mapStatLabel}>{label}</AppText></View>; }

function GlobalLeaderboard({ accuracy }: { accuracy: number }) { const users = [{ name: "PRIYANSHU BORA", score: "25/25", accuracy: "100%" }, { name: "ANKIT KUMAR", score: "24/25", accuracy: "96%" }, { name: "ANAND SINGH", score: "22/25", accuracy: "88%" }, { name: "AMEERUL HAQUE", score: "20/25", accuracy: "80%" }, { name: "YOU", score: `${Math.round((accuracy / 100) * quizQuestions.length)}/${quizQuestions.length}`, accuracy: `${accuracy}%` }]; return <View style={styles.leaderboard}><View style={styles.leaderboardHeader}><AppText weight={FontWeight.semiBold}>♛  GLOBAL TOP 5</AppText><AppText style={styles.viewAll}>View All ›</AppText></View>{users.map((user) => <View key={user.name} style={[styles.leaderboardRow, user.name === "YOU" && styles.youRow]}><View style={styles.avatar} /><AppText style={styles.leaderboardName}>{user.name}</AppText><AppText style={styles.leaderboardScore}>{user.score}</AppText><AppText style={styles.leaderboardAccuracy}>({user.accuracy})</AppText></View>)}</View>; }

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFF" }, header: { height: 51, margin: 9, borderRadius: 10, backgroundColor: Colors.mainColour1, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, liveName: { flexDirection: "row", alignItems: "center", gap: 3 }, liveTitle: { fontSize: Fonts.body }, headerActions: { flexDirection: "row", alignItems: "center", gap: 3 }, headerButton: { height: 17, borderRadius: 3, paddingHorizontal: 4, backgroundColor: Colors.white, flexDirection: "row", alignItems: "center", gap: 2 }, headerButtonText: { fontSize: Fonts.overline }, wifi: { width: 20, height: 17, borderRadius: 3, backgroundColor: Colors.success, alignItems: "center", justifyContent: "center" },
  content: { flexGrow: 1, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 20 }, timer: { width: Fonts.timerIconSize, height: Fonts.timerIconSize, borderRadius: Fonts.timerIconSize / 2, borderWidth: 2, borderColor: Colors.primary, backgroundColor: Colors.white, alignSelf: "center", alignItems: "center", justifyContent: "center" }, timerText: { fontSize: 36 }, feedback: { alignItems: "center", minHeight: 122 }, feedbackTitle: { fontSize: Fonts.h3, marginTop: -4 }, feedbackSubtitle: { fontSize: Fonts.overline, color: Colors.inputColour, textAlign: "center", marginTop: 2 },
  questionCard: { marginTop: 14, borderRadius: 10, padding: 10, backgroundColor: Colors.white, shadowColor: Colors.black, shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 2 }, questionNumber: { alignSelf: "flex-start", fontSize: Fonts.overline, paddingHorizontal: 4, paddingVertical: 3, backgroundColor: "#DDEEFF", borderRadius: 3 }, question: { fontSize: Fonts.bodyLg, lineHeight: 20, marginTop: 9 }, options: { marginTop: 9, gap: 8 }, option: { minHeight: 42, borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, flexDirection: "row", alignItems: "center", gap: 10 }, selectedOption: { backgroundColor: "#EEF4FF" }, optionLetter: { width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" }, optionLetterText: { fontSize: Fonts.bodySm }, optionText: { flex: 1, fontSize: Fonts.caption, lineHeight: 14 }, correctLabel: { fontSize: 8, color: Colors.success }, wrongLabel: { fontSize: 8, color: Colors.danger }, explanation: { marginTop: 10, borderRadius: 8, padding: 10, backgroundColor: "#CFEFE6" }, explanationText: { fontSize: 9, marginTop: 2 }, actions: { flexDirection: "row", gap: 10, marginTop: 10 }, primaryButton: { flex: 1, minHeight: 38, borderRadius: 9, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center" }, secondaryButton: { flex: 1, minHeight: 38, borderRadius: 9, borderWidth: 1, borderColor: Colors.primary, alignItems: "center", justifyContent: "center" }, secondaryButtonText: { color: Colors.primary, fontWeight: FontWeight.semiBold },
  mapButton: { alignSelf: "center", marginTop: 14, borderWidth: 1, borderColor: Colors.primary, borderRadius: 9, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: Colors.white }, mapButtonText: { color: Colors.primary, fontWeight: FontWeight.semiBold },
  mapContent: { flexGrow: 1, padding: 14, paddingTop: 24 }, mapHero: { backgroundColor: Colors.primary, alignItems: "center", borderTopLeftRadius: 14, borderTopRightRadius: 14, paddingVertical: 14 }, mapTitle: { fontSize: Fonts.h2 }, mapSubtitle: { fontSize: Fonts.overline, marginTop: 2 }, mapCard: { backgroundColor: Colors.white, borderBottomLeftRadius: 14, borderBottomRightRadius: 14, padding: 14, shadowColor: Colors.black, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 }, mapStats: { flexDirection: "row", justifyContent: "space-around", paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.gray200 }, mapStat: { alignItems: "center" }, mapStatValue: { fontSize: Fonts.h2 }, mapStatLabel: { fontSize: Fonts.overline, color: Colors.inputColour, marginTop: 2 }, legend: { flexDirection: "row", justifyContent: "space-around", marginVertical: 13 }, legendText: { fontSize: 9, color: Colors.success }, questionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 9, justifyContent: "center" }, mapTile: { width: "17%", aspectRatio: 1, borderRadius: 7, backgroundColor: "#FFF8DF", borderWidth: 1, borderColor: "#FFD35D", justifyContent: "center", alignItems: "center" }, attemptedTile: { backgroundColor: "#E2F5EC", borderColor: "#81D1AD" }, expiredTile: { backgroundColor: "#FFF0F0", borderColor: "#FFA4A4" }, currentTile: { borderWidth: 2, borderColor: Colors.primary }, mapTileText: { color: "#BD8500", fontSize: Fonts.bodyLg }, reviewButton: { height: 42, borderRadius: 9, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center", marginTop: 20 }, submitButton: { height: 42, borderRadius: 9, backgroundColor: "#07935C", alignItems: "center", justifyContent: "center", marginTop: 9 },
  results: { flexGrow: 1, alignItems: "center", padding: 18, paddingTop: 22 }, resultsTitle: { fontSize: Fonts.h2, marginTop: -2 }, resultsSubtitle: { fontSize: Fonts.overline, color: Colors.inputColour, textAlign: "center", marginTop: 2 }, scoreCard: { width: "100%", backgroundColor: Colors.primary, borderRadius: 10, alignItems: "center", marginTop: 14, paddingVertical: 16 }, scoreLabel: { fontSize: Fonts.overline }, scoreValue: { fontSize: Fonts.br, lineHeight: 40 }, scoreDetail: { fontSize: Fonts.bodySm }, summary: { width: "100%", marginTop: 12, backgroundColor: Colors.white, borderRadius: 10, padding: 14 }, summaryRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 14 }, summaryItem: { alignItems: "center" }, summaryValue: { fontSize: Fonts.h3, color: Colors.primary }, summaryLabel: { fontSize: Fonts.overline, color: Colors.inputColour, marginTop: 2 }, leaderboard: { width: "100%", backgroundColor: Colors.white, borderRadius: 10, padding: 12, marginTop: 12 }, leaderboardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }, viewAll: { color: Colors.primary, fontSize: Fonts.caption, fontWeight: FontWeight.semiBold }, leaderboardRow: { minHeight: 31, borderWidth: 1, borderColor: Colors.gray200, borderRadius: 5, paddingHorizontal: 7, flexDirection: "row", alignItems: "center", marginTop: 5 }, youRow: { backgroundColor: "#DDEAFF", borderColor: "#DDEAFF" }, avatar: { width: 17, height: 17, borderRadius: 9, backgroundColor: "#D9E6FE", marginRight: 6 }, leaderboardName: { flex: 1, fontSize: 9 }, leaderboardScore: { color: Colors.primary, fontSize: 9, fontWeight: FontWeight.semiBold, marginRight: 5 }, leaderboardAccuracy: { fontSize: 9 }, continueButton: { width: "100%", flexGrow: 0, marginTop: 16 },
});
