from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    HRFlowable,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageTemplate,
    Paragraph,
    Spacer,
)


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "profile-swetam-meher.pdf"


def make_styles():
    base = getSampleStyleSheet()
    ink = colors.HexColor("#14201f")
    teal = colors.HexColor("#0f766e")
    muted = colors.HexColor("#5b6765")
    amber = colors.HexColor("#c7792b")

    return {
        "name": ParagraphStyle(
            "name",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=25,
            alignment=TA_CENTER,
            textColor=ink,
            spaceAfter=4,
        ),
        "headline": ParagraphStyle(
            "headline",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=10.5,
            leading=13,
            alignment=TA_CENTER,
            textColor=teal,
            spaceAfter=5,
        ),
        "contact": ParagraphStyle(
            "contact",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.6,
            leading=11,
            alignment=TA_CENTER,
            textColor=muted,
            spaceAfter=10,
        ),
        "section": ParagraphStyle(
            "section",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=10.5,
            leading=13,
            textColor=ink,
            spaceBefore=9,
            spaceAfter=5,
            uppercase=True,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9.2,
            leading=12.3,
            textColor=ink,
            alignment=TA_LEFT,
            spaceAfter=5,
        ),
        "small": ParagraphStyle(
            "small",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.6,
            leading=11.2,
            textColor=muted,
            spaceAfter=4,
        ),
        "role": ParagraphStyle(
            "role",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9.7,
            leading=12.3,
            textColor=ink,
            spaceBefore=4,
            spaceAfter=1,
        ),
        "meta": ParagraphStyle(
            "meta",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8.5,
            leading=11,
            textColor=amber,
            spaceAfter=3,
        ),
        "bullet": ParagraphStyle(
            "bullet",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.85,
            leading=11.4,
            leftIndent=0,
            textColor=ink,
        ),
    }


def section(story, styles, title):
    story.append(Paragraph(title, styles["section"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#d9e2de")))
    story.append(Spacer(1, 2))


def bullets(items, styles):
    return ListFlowable(
        [
            ListItem(Paragraph(item, styles["bullet"]), leftIndent=8, bulletColor=colors.HexColor("#0f766e"))
            for item in items
        ],
        bulletType="bullet",
        start="-",
        leftIndent=12,
        bulletFontName="Helvetica",
        bulletFontSize=8.5,
        bulletColor=colors.HexColor("#0f766e"),
        spaceAfter=4,
    )


def build_resume():
    styles = make_styles()
    doc = BaseDocTemplate(
        str(OUT),
        pagesize=A4,
        leftMargin=15 * mm,
        rightMargin=15 * mm,
        topMargin=13 * mm,
        bottomMargin=13 * mm,
        title="Swetam Meher - Resume",
        author="Swetam Meher",
        subject="ETL Developer, SQL, GCP, Informatica, Quantum Treasury Suite",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal")
    doc.addPageTemplates([PageTemplate(id="resume", frames=[frame])])

    story = []
    story.append(Paragraph("SWETAM MEHER", styles["name"]))
    story.append(
        Paragraph(
            "Software Engineer II | ETL Developer | SQL | GCP | Informatica PowerCenter | Quantum Treasury Suite",
            styles["headline"],
        )
    )
    story.append(
        Paragraph(
            "Haywards Heath, England, United Kingdom | +44 7717311654 | mehersitu2013@gmail.com | "
            "linkedin.com/in/swetam-meher | tinyurl.com/swetam-meher",
            styles["contact"],
        )
    )

    section(story, styles, "Professional Summary")
    story.append(
        Paragraph(
            "ETL and data engineering professional with 8+ years of IT experience across requirement analysis, "
            "technical design, Informatica PowerCenter development, SQL validation, testing, release support, and "
            "production operations. Experienced with Quantum Treasury Suite workflows, cloud computing concepts, "
            "GCP-oriented delivery, and Microsoft Azure fundamentals. Known for combining structured engineering "
            "delivery with clear stakeholder communication and a creative eye from graphic design and photography.",
            styles["body"],
        )
    )

    section(story, styles, "Core Skills")
    story.append(
        Paragraph(
            "<b>ETL & Data:</b> Informatica PowerCenter, ETL mapping design, workflow/session support, "
            "data transformation, SQL, database workflows, reconciliation, data quality checks, defect analysis",
            styles["body"],
        )
    )
    story.append(
        Paragraph(
            "<b>Platforms:</b> Google Cloud Platform, Microsoft Azure fundamentals, Quantum Treasury Suite, "
            "cloud computing concepts, enterprise application support",
            styles["body"],
        )
    )
    story.append(
        Paragraph(
            "<b>Delivery:</b> Requirement analysis, technical documentation, testing, production support, "
            "stakeholder communication, issue triage, release handover, team collaboration",
            styles["body"],
        )
    )

    section(story, styles, "Professional Experience")
    story.append(Paragraph("Software Engineer II - IntraEdge", styles["role"]))
    story.append(Paragraph("May 2026 - Present | Burgess Hill, England, United Kingdom", styles["meta"]))
    story.append(
        bullets(
            [
                "Deliver ETL, SQL, cloud-oriented, and enterprise application work for business-critical data workflows.",
                "Translate requirements into maintainable data processing logic, validation approach, and operational support steps.",
                "Partner with stakeholders and delivery teams to clarify data expectations, investigate issues, and support smooth execution.",
                "Apply treasury application knowledge, data quality discipline, and production support awareness to reduce ambiguity in delivery.",
            ],
            styles,
        )
    )

    story.append(Paragraph("Technology Analyst - Infosys", styles["role"]))
    story.append(Paragraph("April 2024 - May 2026 | Brighton, England, United Kingdom", styles["meta"]))
    story.append(
        bullets(
            [
                "Designed, developed, tested, and supported ETL workflows using Informatica PowerCenter and SQL.",
                "Performed requirement analysis, impact assessment, defect triage, and root-cause investigation for data workflows.",
                "Supported Quantum Treasury Suite related data operations with emphasis on accuracy, traceability, and reconciliation.",
                "Prepared clear technical updates and worked with cross-functional stakeholders to keep delivery aligned with business needs.",
                "Contributed to production support routines, release readiness, and handover documentation for maintainable operations.",
            ],
            styles,
        )
    )

    story.append(Paragraph("Technology Analyst - Infosys", styles["role"]))
    story.append(Paragraph("December 2023 - March 2024 | Bhubaneswar, Odisha, India", styles["meta"]))
    story.append(
        bullets(
            [
                "Supported ETL development and analysis activities across database, application, and operational workflows.",
                "Worked on technical documentation, testing support, and issue resolution while coordinating with distributed teams.",
                "Applied SQL and data management knowledge to validate outputs and support predictable delivery.",
            ],
            styles,
        )
    )

    story.append(Paragraph("Senior System Engineer / System Engineer - Infosys", styles["role"]))
    story.append(Paragraph("June 2021 - November 2023 | Bhubaneswar, Odisha, India", styles["meta"]))
    story.append(
        bullets(
            [
                "Built a strong engineering foundation across development support, testing, incident analysis, and data workflow operations.",
                "Worked with SQL, ETL concepts, application support processes, and team-based delivery practices.",
                "Improved ability to move from operational issue analysis to structured technical resolution and stakeholder communication.",
            ],
            styles,
        )
    )

    story.append(Paragraph("Senior Operational Executive / Operational Executive / Trainee - Infosys", styles["role"]))
    story.append(Paragraph("June 2018 - May 2021 | Mysore and Bhubaneswar, India", styles["meta"]))
    story.append(
        bullets(
            [
                "Started career in disciplined IT operations and progressed through increasingly technical delivery responsibilities.",
                "Developed a foundation in process adherence, issue handling, service continuity, client communication, and teamwork.",
            ],
            styles,
        )
    )

    story.append(
        KeepTogether(
            [
                Paragraph("Selected Project Themes", styles["section"]),
                HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#d9e2de")),
                Spacer(1, 2),
                bullets(
                    [
                        "Enterprise ETL delivery: requirement analysis, mapping design, transformation logic, workflow testing, and production handover.",
                        "Treasury data reliability: Quantum Treasury Suite support, reconciliation focus, traceability, and business-critical issue handling.",
                        "Cloud-ready data delivery: SQL validation, platform awareness, documentation, and collaboration for modern data workflows.",
                        "Creative technical communication: visual clarity, structured documentation, and photography/design-led attention to detail.",
                    ],
                    styles,
                ),
            ]
        )
    )

    section(story, styles, "Education")
    story.append(Paragraph("MSc in IT, Information Technology - ISBM University | August 2021 - June 2023", styles["body"]))
    story.append(Paragraph("Graduation, Computer Science - Buxi Jagabandhu Bidyadhar Autonomous College, Bhubaneswar | May 2018", styles["body"]))
    story.append(Paragraph("Intermediate - Institute of Higher Secondary Education, ITER, Bhubaneswar | June 2015", styles["body"]))

    section(story, styles, "Certifications & Recognition")
    story.append(Paragraph("Microsoft Certified: Azure Fundamentals | Introduction to SQL", styles["body"]))
    story.append(Paragraph("Awards: Insta Awards and Eureka RISE Award", styles["body"]))

    section(story, styles, "Additional Strengths")
    story.append(
        Paragraph(
            "Graphic design, photography, visual storytelling, clear documentation, stakeholder collaboration, proactive problem solving.",
            styles["body"],
        )
    )

    doc.build(story)


if __name__ == "__main__":
    OUT.parent.mkdir(parents=True, exist_ok=True)
    build_resume()
    print(OUT)
