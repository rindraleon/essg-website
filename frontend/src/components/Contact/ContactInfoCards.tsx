import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { GREEN } from "../../constants/colors";
import type { ContactInfoCardsProps } from "../../types/contact.types";

const ContactInfoCards: React.FC<ContactInfoCardsProps> = (
    props: Readonly<ContactInfoCardsProps>,
) => {
    const { items = [] } = props;

    return (
        <div className="space-y-6">
            {items.map((item) => (
                <Card
                    key={item.id}
                    sx={{
                        borderRadius: "1rem",
                        border: "1px solid #e5e7eb",
                        transition: "all 0.3s ease",
                        "&:hover": {
                            boxShadow: "0 8px 16px rgba(0,0,0,0.06)",
                            borderColor: GREEN[200],
                        },
                    }}
                >
                    <CardContent className="p-5">
                        <div className="mb-3 flex items-center gap-2">
                            <div
                                className="flex h-9 w-9 items-center justify-center rounded-lg"
                                style={{ backgroundColor: GREEN[50] }}
                            >
                                {item.icon}
                            </div>
                            <h3 className="font-semibold text-gray-900">
                                {item.title}
                            </h3>
                        </div>

                        <div className="space-y-1 pl-11">
                            {item.lines.map((line, index) => (
                                <p
                                    key={`${item.id}-line-${index}`}
                                    className="text-sm text-gray-600"
                                >
                                    {line}
                                </p>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default ContactInfoCards;