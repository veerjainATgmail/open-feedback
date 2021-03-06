import React from 'react'
import { COLORS } from '../../constants/colors'

import { useTranslation } from 'react-i18next'
import { Box, useTheme } from '@material-ui/core'

const Footer = () => {
    const { t } = useTranslation()
    const theme = useTheme()

    const logoColor = theme.palette.type === 'dark' ? 'white' : 'black'

    return (
        <Box
            display="flex"
            alignItems="top"
            justifyContent="center"
            padding={1}
            marginTop={2}
            color={COLORS.LIGHT_GRAY}>
            <span style={{ marginRight: 6, marginTop: -2 }}>
                {t('footer.madeBy')}
            </span>
            <a
                href="https://github.com/HugoGresse/open-feedback"
                target="_blank"
                rel="noopener noreferrer">
                <img
                    height="25"
                    src={`/static/logos/openfeedback-${logoColor}-orange.svg`}
                    alt="open feedback"
                />
            </a>
        </Box>
    )
}

export default Footer
