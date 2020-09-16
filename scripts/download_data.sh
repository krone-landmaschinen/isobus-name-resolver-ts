#!/bin/bash
NEEDS_REBUILD=false

pwd
mkdir -p ${DATA_FOLDER_NAME}
mkdir -p ${ISOBUSPARAMETER_TARGET_FOLDER}

ls -lah ${DATA_FOLDER_NAME}

wget -O "${DATA_FOLDER_NAME}/${ISOBUSPARAMETER_FILENAME}_new" ${ISOBUSPARAMETER_URL}

if [ -n "$(cmp ${DATA_FOLDER_NAME}/${ISOBUSPARAMETER_FILENAME} ${DATA_FOLDER_NAME}/${ISOBUSPARAMETER_FILENAME}_new)" ]
then
  NEEDS_REBUILD=true
  echo ISOBUS parameter files have changed
else
  NEEDS_REBUILD=false
  echo ISOBUS parameter files are same as last run
fi

mv ${DATA_FOLDER_NAME}/${ISOBUSPARAMETER_FILENAME}_new ${DATA_FOLDER_NAME}/${ISOBUSPARAMETER_FILENAME}

if [ "${NEEDS_REBUILD}" = true ] || [ "${EVENT}" == "push" ]
then
    unzip "${DATA_FOLDER_NAME}/isoExport_csv.zip" -d "${ISOBUSPARAMETER_TARGET_FOLDER}"
    ls -lah ${ISOBUSPARAMETER_TARGET_FOLDER}
fi