import React from 'react'
import { array, bool, object, string } from 'yup'
import { Field, Form, Formik } from 'formik'
import OFFormControl from '../../../baseComponents/form/formControl/OFFormControl'
import OFAutoComplete from '../../../baseComponents/form/autoComplete/OFAutoComplete'
import { useTranslation } from 'react-i18next'
import TranslatedTypography from '../../../baseComponents/TranslatedTypography'
import LangMap from 'langmap'
import Grid from '@material-ui/core/Grid'
import { useDispatch, useSelector, useStore } from 'react-redux'
import {
    getLanguagesSelector,
    getSelectedProjectSelector,
} from '../../core/projectSelectors'
import { CircularProgress } from '@material-ui/core'
import FormikAutoSave from '../../../baseComponents/form/autoSave/FormikAutoSave'
import AutoSaveNotice from '../../../baseComponents/layouts/AutoSaveNotice'
import Box from '@material-ui/core/Box'
import langMapArray from '../../utils/convertLangMapArray'
import { editProject } from '../../core/actions/editProject'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { OFSwitch } from '../../../baseComponents/form/switch/OFSwitch'

const SettingsForm = () => {
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const project = useSelector(getSelectedProjectSelector)
    // Doing this prevent the selector to be connected to redux directly, thus prevent future update of initialValues
    const initialLanguages = getLanguagesSelector(useStore().getState())

    return (
        <Formik
            validationSchema={object().shape({
                languages: array().of(string()),
                disableSoloTalkRedirect: bool(),
            })}
            initialValues={{
                languages: initialLanguages.map((tag) => ({
                    ...LangMap[tag],
                    tag,
                })),
                disableSoloTalkRedirect: !project.disableSoloTalkRedirect,
            }}>
            {({ values }) => (
                <Form method="POST">
                    <TranslatedTypography
                        i18nKey="settingsSetup.settings"
                        variant="h5"
                    />
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6}>
                            <OFFormControl
                                name={t('settingsSetup.languages')}
                                fieldName="languages"
                                type="text">
                                <Field
                                    name="languages"
                                    value={values.languages}
                                    dataArray={langMapArray}
                                    keysToDisplay={[
                                        'nativeName',
                                        'englishName',
                                        'tag',
                                    ]}
                                    multiple={true}
                                    component={OFAutoComplete}
                                />
                            </OFFormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <OFFormControl fieldName="disableSoloTalkRedirect">
                                <FormControlLabel
                                    label={t(
                                        'settingsSetup.disableSoloTalkRedirect'
                                    )}
                                    labelPlacement="start"
                                    control={
                                        <Field
                                            name="disableSoloTalkRedirect"
                                            component={OFSwitch}
                                        />
                                    }
                                />
                            </OFFormControl>
                        </Grid>
                    </Grid>

                    <FormikAutoSave
                        onSave={(values) => {
                            const languages = values.languages.map(
                                (value) => value.tag
                            )
                            return dispatch(
                                editProject({
                                    ...values,
                                    languages,
                                    disableSoloTalkRedirect: !values.disableSoloTalkRedirect,
                                })
                            )
                        }}
                        render={({ isSaving, lastSavedDate, saveError }) => (
                            <div>
                                {isSaving ? (
                                    <Box textAlign="right">
                                        {' '}
                                        <CircularProgress />{' '}
                                    </Box>
                                ) : saveError ? (
                                    `Error: ${saveError}`
                                ) : lastSavedDate ? (
                                    <AutoSaveNotice saveDate={lastSavedDate} />
                                ) : (
                                    ''
                                )}
                            </div>
                        )}
                    />
                </Form>
            )}
        </Formik>
    )
}

export default SettingsForm
