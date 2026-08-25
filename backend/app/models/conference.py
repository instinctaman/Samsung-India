from sqlalchemy import Column, DateTime, Integer, Numeric, String, Text, text
from sqlalchemy.sql import func

from app.database.database import Base


class Conference(Base):
    """Mirrors the `conference` table from the mmtbtwob_tops schema.
    Includes full financial billing columns, live-quiz state columns,
    file attachments, and audit trail fields."""

    __tablename__ = "conference"

    id = Column(Integer, primary_key=True, index=True)
    conferenceUid = Column(String(100), unique=True)

    zone = Column(String(120))
    region = Column(String(150))
    company = Column(String(100))
    requestedBy = Column(String(100))

    trainerEmployeeId = Column(String(100))
    trainerName = Column(String(100))

    conferenceType = Column(String(100), nullable=False, server_default=text("'Non Residential Conference'"))
    conferenceDate = Column(String(100))
    conferenceEndsOn = Column(String(100))
    conferenceTime = Column(String(100))
    conferenceStatus = Column(String(100), nullable=False, server_default=text("'Scheduled'"))
    activeModuleId = Column(String(50))
    actualStartedAt = Column(DateTime)
    actualEndedAt = Column(DateTime)
    enableCheckIn = Column(Integer, server_default=text("0"))

    # Live Quiz state machine
    liveQuizState = Column(String(50), nullable=False, server_default=text("'IDLE'"))
    liveQuestionId = Column(String(100))
    liveTimerEndsAt = Column(Integer, server_default=text("0"))

    trainingHub = Column(String(100))
    audience = Column(String(150))
    sessionType = Column(String(150))
    trainingType = Column(String(100))
    batchSize = Column(String(150))
    confirmedPax = Column(String(150), server_default=text("'0'"))
    attendanceSheetPax = Column(String(100), nullable=False, server_default=text("'0'"))
    suiteTitle = Column(Text)

    state = Column(String(150))
    district = Column(String(150))
    venueUid = Column(String(150))
    geoLatitude = Column(Numeric(10, 8))
    geoLongitude = Column(Numeric(11, 8))
    geoRadius = Column(Integer, server_default=text("100"))

    assessmentFor = Column(String(100))
    preAssessmentUid = Column(String(100))
    postAssessmentUid = Column(String(100))
    surveyUid = Column(String(100))
    noOfQuestion = Column(String(100), nullable=False, server_default=text("'1'"))

    sessionConfig = Column(Text)
    checklistUid = Column(String(255))

    # ── Financial: Purchase side ──────────────────────────────────────────
    purchaseTariff = Column(Numeric(10, 2), nullable=False, server_default=text("0.00"))
    purchaseTax = Column(String(10), nullable=False, server_default=text("'Nett'"))
    totalTax = Column(Numeric(10, 2), nullable=False, server_default=text("0.00"))
    totalPurchase = Column(Numeric(10, 2), nullable=False, server_default=text("0.00"))
    totalWithTax = Column(Numeric(10, 2), nullable=False, server_default=text("0.00"))
    commissionFromPartner = Column(Numeric(10, 2), nullable=False, server_default=text("0.00"))
    TDSRate = Column(String(10), nullable=False, server_default=text("'Nett'"))
    TDS = Column(Numeric(10, 2), nullable=False, server_default=text("0.00"))
    finalBillValue = Column(Numeric(10, 2), nullable=False, server_default=text("0.00"))

    # ── Financial: Sales side ─────────────────────────────────────────────
    salesTariff = Column(Numeric(10, 2), nullable=False, server_default=text("0.00"))
    salesTax = Column(String(10), nullable=False, server_default=text("'Nett'"))
    totalSalesTax = Column(Numeric(10, 2), nullable=False, server_default=text("0.00"))
    totalSales = Column(Numeric(10, 2), nullable=False, server_default=text("0.00"))
    totalSalesWithTax = Column(Numeric(10, 2), nullable=False, server_default=text("0.00"))
    discounts = Column(Numeric(10, 2), nullable=False, server_default=text("0.00"))
    finalSaleValue = Column(Numeric(10, 2), nullable=False, server_default=text("0.00"))

    # ── File attachments ──────────────────────────────────────────────────
    attendanceSheet = Column(String(300))
    hotelBill = Column(String(300))
    conferenceImage = Column(String(300))
    startConferenceImage = Column(String(300))
    hotelInvoiceFile = Column(String(300))
    travelInvoiceFile = Column(String(300))
    saleInvoiceFile = Column(String(300))
    paymentReceiptFile = Column(String(300))
    tdsCertificateFile = Column(String(300))

    # Upload tracking
    filePath = Column(String(200))
    logPath = Column(String(200))
    excelUploadedOn = Column(String(200))

    # Audit / meta
    updatedBy = Column(String(100))
    updationOn = Column(DateTime, onupdate=func.now())
    isRead = Column(String(50))
    token = Column(String(100))
    timestamp = Column(DateTime, server_default=func.now(), nullable=False)
    status = Column(String(100), nullable=False, server_default=text("'Pending'"))

    # Audit review
    auditStatus = Column(String(50), server_default=text("'Pending'"))
    auditRemarks = Column(Text)
    auditBy = Column(String(100))
    auditDate = Column(DateTime)

    remarks = Column(Text)
    securityDetails = Column(Text)
    masterRemarks = Column(Text)
