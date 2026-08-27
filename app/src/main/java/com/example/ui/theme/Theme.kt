package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = AquaLight,
    onPrimary = NavyDark,
    primaryContainer = AquaDeep,
    onPrimaryContainer = AquaIce,
    secondary = AquaSecondary,
    onSecondary = PureWhite,
    secondaryContainer = DarkSurfaceVariant,
    onSecondaryContainer = AquaPale,
    tertiary = BstiGreen,
    onTertiary = PureWhite,
    background = DarkBackground,
    onBackground = AquaIce,
    surface = DarkSurface,
    onSurface = AquaIce,
    surfaceVariant = DarkSurfaceVariant,
    onSurfaceVariant = AquaPale,
    outline = AquaDeep
)

private val LightColorScheme = lightColorScheme(
    primary = AquaPrimary,
    onPrimary = PureWhite,
    primaryContainer = AquaIce,
    onPrimaryContainer = NavyHeading,
    secondary = AquaSecondary,
    onSecondary = PureWhite,
    secondaryContainer = AquaIce,
    onSecondaryContainer = AquaDeep,
    tertiary = BstiGreen,
    onTertiary = PureWhite,
    background = AquaBackground,
    onBackground = NavyHeading,
    surface = PureWhite,
    onSurface = NavyDark,
    surfaceVariant = AquaIce,
    onSurfaceVariant = SlateGray,
    outline = SoftBorder
)

@Composable
fun MiladWaterTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
