package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.FlashOn
import androidx.compose.material.icons.filled.ShoppingBag
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.AppLanguage
import com.example.ui.theme.AquaDeep
import com.example.ui.theme.AquaIce
import com.example.ui.theme.AquaLight
import com.example.ui.theme.AquaPale
import com.example.ui.theme.AquaPrimary
import com.example.ui.theme.AquaSecondary
import com.example.ui.theme.NavyDark
import com.example.ui.theme.NavyHeading
import com.example.ui.theme.PureWhite
import com.example.ui.theme.NavyHeading
import com.example.ui.theme.PureWhite

@Composable
fun FloatingBottomBar(
    language: AppLanguage,
    onCallClick: () -> Unit,
    onQuickOrderClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val isBn = language == AppLanguage.BN

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .navigationBarsPadding(),
        color = PureWhite,
        shadowElevation = 16.dp,
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE2EDF4))
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 10.dp),
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Direct Call CTA button
            Button(
                onClick = onCallClick,
                modifier = Modifier
                    .weight(1f)
                    .height(48.dp)
                    .testTag("floating_call_button"),
                colors = ButtonDefaults.buttonColors(
                    containerColor = AquaIce,
                    contentColor = AquaDeep
                ),
                shape = RoundedCornerShape(14.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, AquaPale)
            ) {
                Icon(
                    imageVector = Icons.Default.Call,
                    contentDescription = "Call",
                    modifier = Modifier.size(18.dp),
                    tint = AquaDeep
                )
                Spacer(modifier = Modifier.width(6.dp))
                Column(horizontalAlignment = Alignment.Start) {
                    Text(
                        text = if (isBn) "কল করুন" else "Call Now",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = AquaDeep
                    )
                    Text(
                        text = "+8801711102448",
                        fontSize = 9.sp,
                        color = NavyHeading,
                        fontWeight = FontWeight.Medium
                    )
                }
            }

            // Quick Online Order CTA button
            Button(
                onClick = onQuickOrderClick,
                modifier = Modifier
                    .weight(1.3f)
                    .height(48.dp)
                    .testTag("floating_order_button"),
                colors = ButtonDefaults.buttonColors(
                    containerColor = AquaPrimary,
                    contentColor = PureWhite
                ),
                shape = RoundedCornerShape(14.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.FlashOn,
                    contentDescription = "Quick Order",
                    modifier = Modifier.size(18.dp),
                    tint = Color(0xFFFFD54F)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = if (isBn) "এখনই অর্ডার করুন" else "Order Online Now",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}
