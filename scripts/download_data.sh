#!/bin/bash
NEEDS_REBUILD=false

mkdir -p ${DATA_FOLDER_NAME}
mkdir -p ${ISOBUSPARAMETER_TARGET_FOLDER}

wget -O "${DATA_FOLDER_NAME}/${ISOBUSPARAMETER_FILENAME}_new" ${ISOBUSPARAMETER_URL}

if [ ! -f "${DATA_FOLDER_NAME}/${ISOBUSPARAMETER_FILENAME}_new" ]
then
    echo "Unable to download isobus parameter files."
    exit 1
fi

if [ -f "${DATA_FOLDER_NAME}/${ISOBUSPARAMETER_FILENAME}" ]
then
    if [ -n "$(cmp ${DATA_FOLDER_NAME}/${ISOBUSPARAMETER_FILENAME} ${DATA_FOLDER_NAME}/${ISOBUSPARAMETER_FILENAME}_new)" ]
    then
        NEEDS_REBUILD=true
        echo ISOBUS parameter files have changed
    else
        NEEDS_REBUILD=false
        echo ISOBUS parameter files are same as last run
    fi
else
    NEEDS_REBUILD=true
    echo Last ISOBUS parameter file does not exist
fi

mv ${DATA_FOLDER_NAME}/${ISOBUSPARAMETER_FILENAME}_new ${DATA_FOLDER_NAME}/${ISOBUSPARAMETER_FILENAME}

if [ "${NEEDS_REBUILD}" = true ] || [ "${EVENT}" == "push" ]
then
    unzip "${DATA_FOLDER_NAME}/isoExport_csv.zip" -d "${ISOBUSPARAMETER_TARGET_FOLDER}"
    ls -lah ${ISOBUSPARAMETER_TARGET_FOLDER}
    NEEDS_REBUILD=true
fi

echo "::set-env name=NEEDS_REBUILD::$NEEDS_REBUILD"