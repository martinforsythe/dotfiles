#!/usr/bin/env bash
#
# pyenv virtualenv hook
# Rename this file to: /usr/local/opt/pyenv/pyenv.d/virtualenv/venv_hook.bash
#
# From: https://github.com/pyenv/pyenv-virtualenv/issues/178#issuecomment-387862525
#
after_virtualenv "BASE_VERSION=\"$(echo $VIRTUALENV_NAME | awk -F/ '{print $(NF-2)}')\""
after_virtualenv "VENVNAME=\"$(echo $VIRTUALENV_NAME | awk -F/ '{print $(NF)}')\""
after_virtualenv 'CONDA=${PYENV_ROOT}/versions/${BASE_VERSION}/bin/conda'
after_virtualenv 'ACTIVATE=${PYENV_ROOT}/versions/${BASE_VERSION}/bin/activate'
after_virtualenv "echo $BASE_VERSION"
after_virtualenv 'if [[ $BASE_VERSION = *"conda"* ]]; then echo "...linking conda and activate"; fi'
after_virtualenv 'if [[ $BASE_VERSION = *"conda"* ]]; then ln -s ${CONDA} ${PYENV_ROOT}/versions/${VENVNAME}/bin/; fi'
after_virtualenv 'if [[ $BASE_VERSION = *"conda"* ]]; then ln -s ${ACTIVATE} ${PYENV_ROOT}/versions/${VENVNAME}/bin/; fi'
# conda environments are not proper virtualenvs so PIP_REQUIRE_VIRTUALENV does not work
# see discussion at: https://github.com/pyenv/pyenv-virtualenv/issues/223
after_virtualenv 'if [[ $BASE_VERSION = *"conda"* ]]; then export PIP_REQUIRE_VIRTUALENV=false; fi'
after_virtualenv 'if [[ $BASE_VERSION = *"conda"* ]]; then export VIRTUAL_ENV=${PYENV_ROOT}/versions/${VENVNAME}/; fi'
