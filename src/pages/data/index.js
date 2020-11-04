/**
 *
 * @author sriram, aramsey
 */
import React, { Fragment, useEffect } from "react";
import { useRouter } from "next/router";

import constants from "../../constants";
import {
    getEncodedPath,
    getPageQueryParams,
} from "../../components/data/utils";
import { useUserProfile } from "../../contexts/userProfile";
import { useConfig } from "../../contexts/config";

/**
 *
 * Handle default routing to /data
 *
 * By default, redirect to the base path for the data store
 */
export default function Data() {
    const router = useRouter();
    const [userProfile] = useUserProfile();
    const [config] = useConfig();

    useEffect(() => {
        const username = userProfile?.id;
        const irodsHomePath = config?.irods?.home_path;

        if (irodsHomePath) {
            const defaultParams = getPageQueryParams();
            const defaultPath = getEncodedPath(
                username
                    ? `${irodsHomePath}/${username}`
                    : `${irodsHomePath}/shared`
            );
            router.push(
                `${router.pathname}${constants.PATH_SEPARATOR}${constants.DATA_STORE_STORAGE_ID}${defaultPath}?${defaultParams}`
            );
        }
    }, [router, config, userProfile]);

    return <Fragment />;
}

Data.getInitialProps = async () => ({
    namespacesRequired: ["data"],
});
