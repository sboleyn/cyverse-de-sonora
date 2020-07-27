import React, { useLayoutEffect, useState, useRef } from "react";
import clsx from "clsx";

import { Divider, Typography } from "@material-ui/core";

import DashboardItem, { getItem, DashboardFeedItem } from "./DashboardItem";

import useStyles from "./styles";
import * as fns from "./functions";
import * as constants from "./constants";
import ids from "./ids";

const SectionContentCards = ({ items, kind, section, id, height, width }) => {
    const classes = useStyles();

    return (
        <div className={classes.sectionItems}>
            {items.map((item, index) => {
                const obj = getItem({
                    kind,
                    section,
                    content: item,
                    height,
                    width,
                    classes,
                });
                return <DashboardItem key={fns.makeID(id, index)} item={obj} />;
            })}
        </div>
    );
};

const SectionContentFeed = ({ items, kind, section, id, height, width }) => {
    const classes = useStyles();

    return (
        <div className={classes.sectionItems}>
            {items.map((item, index) => {
                const obj = getItem({
                    kind,
                    section,
                    content: item,
                    height,
                    width,
                    classes,
                });
                return (
                    <DashboardFeedItem key={fns.makeID(id, index)} item={obj} />
                );
            })}
        </div>
    );
};

const DashboardSection = ({
    name,
    kind,
    items,
    id,
    section,
    showDivider = true,
}) => {
    const classes = useStyles();

    const dashboardEl = useRef();

    // Adapted from https://stackoverflow.com/questions/49058890/how-to-get-a-react-components-size-height-width-before-render
    // and https://stackoverflow.com/questions/19014250/rerender-view-on-browser-resize-with-react/19014495#19014495
    const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

    useLayoutEffect(() => {
        function updater() {
            if (dashboardEl.current) {
                setDimensions({
                    width: dashboardEl.current.offsetWidth,
                    height: dashboardEl.current.offsetHeight,
                });
            }
        }
        window.addEventListener("resize", updater);
        updater();
        return () => window.removeEventListener("resize", updater);
    }, [dashboardEl, setDimensions]);

    const [width, height] = fns.useDashboardSettings(dimensions);

    const isNewsSection = section === constants.SECTION_NEWS;
    const isEventsSection = section === constants.SECTION_EVENTS;
    const isFeedItem =
        (kind === constants.KIND_FEEDS || kind === constants.KIND_EVENTS) &&
        (isNewsSection || isEventsSection);

    return (
        <div
            ref={dashboardEl}
            className={clsx(
                classes.section,
                isNewsSection && classes.sectionNews,
                isEventsSection && classes.sectionEvents
            )}
            id={id}
        >
            {showDivider && <Divider classes={{ root: classes.dividerRoot }} />}

            <Typography
                noWrap
                gutterBottom
                variant="h5"
                component="h5"
                color="primary"
            >
                {name}
            </Typography>
            {isFeedItem ? (
                <SectionContentFeed
                    id={id}
                    height={height}
                    width={width}
                    section={section}
                    kind={kind}
                    items={items}
                />
            ) : (
                <SectionContentCards
                    id={id}
                    height={height}
                    width={width}
                    section={section}
                    kind={kind}
                    items={items}
                />
            )}
        </div>
    );
};

class SectionBase {
    constructor(kind, name, labelName, idBase) {
        this.kind = kind;
        this.name = name;
        this.label = labelName;
        this.id = fns.makeID(idBase);
    }

    getComponent({ t, data, showDivider }) {
        return (
            <DashboardSection
                id={this.id}
                kind={this.kind}
                key={`${this.kind}-${this.name}`}
                items={data[this.kind][this.name]}
                name={t(this.label)}
                section={this.name}
                showDivider={showDivider}
            />
        );
    }
}

export class RecentAnalyses extends SectionBase {
    constructor() {
        super(
            constants.KIND_ANALYSES,
            constants.SECTION_RECENT,
            "recentAnalyses",
            ids.SECTION_RECENT_ANALYSES
        );
    }

    getComponent(params) {
        return super.getComponent(params);
    }
}

export class RunningAnalyses extends SectionBase {
    constructor() {
        super(
            constants.KIND_ANALYSES,
            constants.SECTION_RUNNING,
            "runningAnalyses",
            ids.SECTION_RECENT_ANALYSES
        );
    }
    getComponent(params) {
        return super.getComponent(params);
    }
}

export class RecentlyAddedApps extends SectionBase {
    constructor() {
        super(
            constants.KIND_APPS,
            constants.SECTION_RECENTLY_ADDED,
            "recentlyAddedApps",
            ids.SECTION_RECENTLY_ADDED_APPS
        );
    }
    getComponent(params) {
        return super.getComponent(params);
    }
}

export class PublicApps extends SectionBase {
    constructor() {
        super(
            constants.KIND_APPS,
            constants.SECTION_PUBLIC,
            "publicApps",
            ids.SECTION_PUBLIC_APPS
        );
    }

    getComponent(params) {
        return super.getComponent(params);
    }
}

export class NewsFeed extends SectionBase {
    constructor() {
        super(
            constants.KIND_FEEDS,
            constants.SECTION_NEWS,
            "newsFeed",
            ids.SECTION_NEWS
        );
    }

    getComponent(params) {
        return super.getComponent(params);
    }
}

export class EventsFeed extends SectionBase {
    constructor() {
        super(
            constants.KIND_FEEDS,
            constants.SECTION_EVENTS,
            "eventsFeed",
            ids.SECTION_EVENTS
        );
    }

    getComponent(params) {
        return super.getComponent(params);
    }
}
