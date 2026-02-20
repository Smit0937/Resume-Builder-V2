from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    ListFlowable,
    ListItem,
    HRFlowable
)
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.pagesizes import A4
from io import BytesIO


def generate_resume_pdf(data):

    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=50,
        leftMargin=50,
        topMargin=50,
        bottomMargin=50
    )

    elements = []
    styles = getSampleStyleSheet()

    # ===== Custom Styles =====

    name_style = ParagraphStyle(
        'NameStyle',
        parent=styles['Heading1'],
        fontSize=22,
        spaceAfter=6
    )

    section_style = ParagraphStyle(
        'SectionStyle',
        parent=styles['Heading2'],
        fontSize=13,
        spaceAfter=6
    )

    normal_style = ParagraphStyle(
        'NormalStyle',
        parent=styles['Normal'],
        fontSize=11,
        leading=14
    )

    # ===== HEADER =====

    name = data["resume"].get("title") or "Your Name"
    elements.append(Paragraph(name, name_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.black))
    elements.append(Spacer(1, 0.25 * inch))

    # ===== SUMMARY =====

    summary = data["resume"].get("summary")
    if summary:
        elements.append(Paragraph("PROFESSIONAL SUMMARY", section_style))
        elements.append(Spacer(1, 0.1 * inch))
        elements.append(Paragraph(summary, normal_style))
        elements.append(Spacer(1, 0.35 * inch))

    # ===== EXPERIENCE =====

    if data["experience"]:
        elements.append(Paragraph("EXPERIENCE", section_style))
        elements.append(Spacer(1, 0.15 * inch))

        for exp in data["experience"]:
            role_line = f"<b>{exp['role']}</b> | {exp['company']}"
            elements.append(Paragraph(role_line, normal_style))
            elements.append(Spacer(1, 0.08 * inch))

            if exp["description"]:
                elements.append(Paragraph(exp["description"], normal_style))
                elements.append(Spacer(1, 0.2 * inch))

        elements.append(Spacer(1, 0.3 * inch))

    # ===== EDUCATION =====

    if data["education"]:
        elements.append(Paragraph("EDUCATION", section_style))
        elements.append(Spacer(1, 0.15 * inch))

        for edu in data["education"]:
            text = f"<b>{edu['degree']}</b> | {edu['institution']} ({edu['start_year']} - {edu['end_year']})"
            elements.append(Paragraph(text, normal_style))
            elements.append(Spacer(1, 0.2 * inch))

        elements.append(Spacer(1, 0.3 * inch))

    # ===== PROJECTS =====

    if data["projects"]:
        elements.append(Paragraph("PROJECTS", section_style))
        elements.append(Spacer(1, 0.15 * inch))

        for proj in data["projects"]:
            elements.append(
                Paragraph(f"<b>{proj['project_title']}</b>", normal_style)
            )
            elements.append(Spacer(1, 0.08 * inch))

            if proj["description"]:
                elements.append(Paragraph(proj["description"], normal_style))
                elements.append(Spacer(1, 0.2 * inch))

        elements.append(Spacer(1, 0.3 * inch))

    # ===== SKILLS =====

    if data["skills"]:
        elements.append(Paragraph("SKILLS", section_style))
        elements.append(Spacer(1, 0.15 * inch))

        skill_text = ", ".join([skill["skill_name"] for skill in data["skills"]])
        elements.append(Paragraph(skill_text, normal_style))
        elements.append(Spacer(1, 0.3 * inch))

    # ===== CERTIFICATIONS =====

    if data["certifications"]:
        elements.append(Paragraph("CERTIFICATIONS", section_style))
        elements.append(Spacer(1, 0.15 * inch))

        for cert in data["certifications"]:
            text = f"<b>{cert['title']}</b> | {cert['organization']} ({cert['issue_year']})"
            elements.append(Paragraph(text, normal_style))
            elements.append(Spacer(1, 0.2 * inch))

    doc.build(elements)

    buffer.seek(0)
    return buffer
