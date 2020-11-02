#!/bin/bash

mkdir -p ${DATA_FOLDER_NAME}
mkdir -p ${ISOBUSPARAMETER_TARGET_FOLDER}

echo "Downloading file from url '${ISOBUSPARAMETER_URL}' into local file '${DATA_FOLDER_NAME}/${ISOBUSPARAMETER_FILENAME}' ..."
wget -O "${DATA_FOLDER_NAME}/${ISOBUSPARAMETER_FILENAME}" ${ISOBUSPARAMETER_URL}

if [ ! -f "${DATA_FOLDER_NAME}/${ISOBUSPARAMETER_FILENAME}" ]
then
    echo "Unable to download isobus parameter files."
    exit 1
fi

unzip "${DATA_FOLDER_NAME}/${ISOBUSPARAMETER_FILENAME}" -d "${ISOBUSPARAMETER_TARGET_FOLDER}"
ls -lah ${ISOBUSPARAMETER_TARGET_FOLDER}
