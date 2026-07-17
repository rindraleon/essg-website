import React, { useState } from "react";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { GREEN } from "../../constants/colors";
import type { FaqAccordionProps } from "../../types/faq.types";

const FaqAccordion: React.FC<FaqAccordionProps> = (
    props: Readonly<FaqAccordionProps>,
) => {
    const { faqs } = props;
    const [expanded, setExpanded] = useState<string | false>(false);

    const handleChange =
        (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    return (
        <Card
            sx={{
                borderRadius: "1rem",
                border: "1px solid #e5e7eb",
            }}
        >
            <CardContent className="p-6 sm:p-8">
                <div className="space-y-3">
                    {faqs.map((faq, index) => {
                        const panelId = `faq-${index}`;

                        return (
                            <Accordion
                                key={panelId}
                                expanded={expanded === panelId}
                                onChange={handleChange(panelId)}
                                sx={{
                                    borderRadius: "0.75rem !important",
                                    border: "1px solid #e5e7eb",
                                    boxShadow: "none",
                                    overflow: "hidden",
                                    "&:before": {
                                        display: "none",
                                    },
                                    "&.Mui-expanded": {
                                        margin: 0,
                                        borderColor: GREEN[200],
                                    },
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={
                                        <ExpandMoreRoundedIcon
                                            sx={{
                                                color:
                                                    expanded === panelId
                                                        ? GREEN[600]
                                                        : "gray",
                                            }}
                                        />
                                    }
                                    sx={{
                                        px: 2.5,
                                        "&.Mui-expanded": {
                                            backgroundColor: GREEN[50],
                                        },
                                    }}
                                >
                                    <span
                                        className="pr-4 font-semibold"
                                        style={{
                                            color:
                                                expanded === panelId
                                                    ? GREEN[800]
                                                    : "#111827",
                                        }}
                                    >
                                        {faq.question}
                                    </span>
                                </AccordionSummary>

                                <AccordionDetails
                                    sx={{
                                        px: 2.5,
                                        py: 2,
                                    }}
                                >
                                    <p className="leading-relaxed text-gray-600">
                                        {faq.reponse}
                                    </p>
                                </AccordionDetails>
                            </Accordion>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};

export default FaqAccordion;