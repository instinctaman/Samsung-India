import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";
import { Spacing } from "@/theme/spacing";

export type AppFooterItem = {
  key: string;
  label?: string;
  icon: (props: { size: number; color: string }) => React.ReactNode;
  onPress: () => void;
  active?: boolean;
  /** Marks this item as the raised center action. Defaults to the middle item. */
  center?: boolean;
  /** Greys the item out and blocks onPress - e.g. a finished session's action. */
  disabled?: boolean;
};

type AppFooterProps = {
  items: AppFooterItem[];
};

export default function AppFooter({ items }: AppFooterProps) {
  const explicitIndex = items.findIndex((item) => item.center);
  const centerIndex =
    explicitIndex !== -1
      ? explicitIndex
      : items.length >= 3
        ? Math.floor(items.length / 2)
        : -1;
  const centerItem = centerIndex !== -1 ? items[centerIndex] : undefined;
  const leftItems = centerItem ? items.slice(0, centerIndex) : items;
  const rightItems = centerItem ? items.slice(centerIndex + 1) : [];

  return (
    <SafeAreaView style={styles.bottomArea} edges={["bottom"]}>
      <View
        style={[
          styles.navBar,
          !centerItem && styles.navBarNoCenter,
        ]}
      >
        <View style={styles.sideGroup}>
          {leftItems.map((item) => (
            <NavItem key={item.key} item={item} />
          ))}
        </View>

        {centerItem && (
          <View style={styles.centerWrap}>
            <Pressable
              style={[styles.centerAction, centerItem.disabled && styles.centerActionDisabled]}
              accessibilityLabel={centerItem.label}
              disabled={centerItem.disabled}
              onPress={centerItem.onPress}
            >
              {centerItem.icon({ size: 31, color: Colors.white })}
            </Pressable>
            {centerItem.label && (
              <AppText
                style={[
                  styles.centerLabel,
                  centerItem.disabled && styles.centerLabelDisabled,
                ]}
              >
                {centerItem.label}
              </AppText>
            )}
          </View>
        )}

        <View style={styles.sideGroup}>
          {rightItems.map((item) => (
            <NavItem key={item.key} item={item} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

function NavItem({ item }: { item: AppFooterItem }) {
  const color = item.active ? Colors.mainColour1 : Colors.gray600;

  return (
    <Pressable style={styles.navItem} onPress={item.onPress}>
      {item.icon({ size: 23, color })}
      {item.label && (
        <AppText
          style={[
            styles.navLabel,
            item.active && styles.navLabelActive,
          ]}
        >
          {item.label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bottomArea: {
    backgroundColor: Colors.white,
    paddingTop: Spacing.lg,
    // paddingBottom: Spacing.lg,
    paddingBottom: 50,
    paddingHorizontal: 50,
    ...Shadows.footer,
  },

  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 20,
  },

  navBarNoCenter: {
    justifyContent: "center",
  },

  sideGroup: {
    flexDirection: "row",
    gap: Spacing.xl,
  },

  navItem: {
    alignItems: "center",
    gap: Spacing.xs,
  },

  navLabel: {
    fontSize: Fonts.caption,
    color: Colors.gray600,
  },

  navLabelActive: {
    color: Colors.mainColour1,
  },

  centerWrap: {
    position: "absolute",
    top: -25,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  centerAction: {
    width: 58,
    height: 58,
    borderRadius: Radius.pill,
    backgroundColor: Colors.mainColour1,
    borderWidth: 3,
    borderColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.raised,
  },

  centerActionDisabled: {
    backgroundColor: Colors.gray400,
  },

  centerLabel: {
    marginTop: 4,
    fontSize: Fonts.caption,
    color: Colors.mainColour1,
  },

  centerLabelDisabled: {
    color: Colors.gray400,
  },
});
