import React from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { GREEN } from "../../constants/colors";
import type { FilterToolbarProps } from "../../types/common.types";

const FilterToolbar: React.FC<FilterToolbarProps> = (
    props: Readonly<FilterToolbarProps>,
) => {
    const {
        resultText,
        showFilters,
        activeFilterCount = 0,
        hasActiveFilters = false,
        activeFilterChips = [],
        onToggleFilters,
        onResetFilters,
        children,
        searchEnabled = false,
        showSearch = false,
        searchIsActive = false,
        onToggleSearch,
        searchContent,
    } = props;

    return (
        <section className="sticky top-24 z-40 border-b border-gray-200 bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-4">
                    <span className="text-sm font-medium text-gray-600">
                        {resultText}
                    </span>

                    <div className="flex items-center gap-1">
                        {searchEnabled && onToggleSearch && (
                            <Tooltip
                                title={
                                    showSearch
                                        ? "Fermer la recherche"
                                        : "Rechercher"
                                }
                            >
                                <IconButton
                                    onClick={onToggleSearch}
                                    sx={{
                                        backgroundColor: showSearch
                                            ? GREEN[50]
                                            : "transparent",
                                        color: showSearch
                                            ? GREEN[700]
                                            : "gray",
                                        "&:hover": {
                                            backgroundColor: GREEN[50],
                                            color: GREEN[700],
                                        },
                                    }}
                                >
                                    {showSearch ? (
                                        <CloseRoundedIcon />
                                    ) : (
                                        <Badge
                                            variant="dot"
                                            invisible={!searchIsActive}
                                            sx={{
                                                "& .MuiBadge-badge": {
                                                    backgroundColor:
                                                        GREEN[600],
                                                },
                                            }}
                                        >
                                            <SearchRoundedIcon />
                                        </Badge>
                                    )}
                                </IconButton>
                            </Tooltip>
                        )}

                        <Tooltip
                            title={
                                showFilters ? "Fermer les filtres" : "Filtrer"
                            }
                        >
                            <IconButton
                                onClick={onToggleFilters}
                                sx={{
                                    backgroundColor: showFilters
                                        ? GREEN[50]
                                        : "transparent",
                                    color: showFilters ? GREEN[700] : "gray",
                                    "&:hover": {
                                        backgroundColor: GREEN[50],
                                        color: GREEN[700],
                                    },
                                }}
                            >
                                {showFilters ? (
                                    <CloseRoundedIcon />
                                ) : (
                                    <Badge
                                        badgeContent={activeFilterCount}
                                        sx={{
                                            "& .MuiBadge-badge": {
                                                backgroundColor: GREEN[600],
                                                color: "#fff",
                                            },
                                        }}
                                    >
                                        <FilterListRoundedIcon />
                                    </Badge>
                                )}
                            </IconButton>
                        </Tooltip>

                        {hasActiveFilters && (
                            <Button
                                variant="text"
                                size="small"
                                onClick={onResetFilters}
                                sx={{
                                    ml: 1,
                                    textTransform: "none",
                                    color: GREEN[600],
                                    fontWeight: 600,
                                    "&:hover": {
                                        backgroundColor: GREEN[50],
                                    },
                                }}
                            >
                                Réinitialiser
                            </Button>
                        )}
                    </div>
                </div>

                {searchEnabled && (
                    <Collapse in={showSearch}>
                        <div className="pb-4">{searchContent}</div>
                    </Collapse>
                )}

                <Collapse in={showFilters}>
                    <div className="pb-4">{children}</div>
                </Collapse>

                {hasActiveFilters && activeFilterChips.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pb-4">
                        {activeFilterChips.map((chipItem) => (
                            <Chip
                                key={chipItem.key}
                                label={chipItem.label}
                                size="small"
                                onDelete={chipItem.onDelete}
                                sx={{
                                    backgroundColor: GREEN[50],
                                    color: GREEN[800],
                                    "& .MuiChip-deleteIcon": {
                                        color: GREEN[600],
                                        "&:hover": { color: GREEN[800] },
                                    },
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FilterToolbar;