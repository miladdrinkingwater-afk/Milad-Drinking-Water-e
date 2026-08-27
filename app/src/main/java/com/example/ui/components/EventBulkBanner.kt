package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Celebration
import androidx.compose.material.icons.filled.EventNote
import androidx.compose.material.icons.filled.Groups
import androidx.compose.material.icons.filled.WaterDrop
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
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
import com.example.ui.theme.AquaPale
import com.example.ui.theme.AquaPrimary
import com.example.ui.theme.AquaSecondary
import com.example.ui.theme.NavyDark
import com.example.ui.theme.NavyHeading
import com.example.ui.theme.PureWhite

@Composable
fun EventBulkBanner(
    language: AppLanguage,
    onEventOrderClick: () -> Unit,
    onCallClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val isBn = language == AppLanguage.BN

    Box(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 20.dp)
            .testTag("event_bulk_banner")
    ) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(22.dp),
            colors = CardDefaults.cardColors(containerColor = NavyDark),
            elevation = CardDefaults.cardElevation(defaultElevation = 6.dp)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        Brush.linearGradient(
                            colors = listOf(
                                Color(0xFF071B33),
                                Color(0xFF0F3860),
                                AquaDeep
                            )
                        )
                    )
                    .padding(20.dp)
            ) {
                Column(modifier = Modifier.fillMaxWidth()) {
                    // Top Event Tag
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Surface(
                            shape = RoundedCornerShape(20.dp),
                            color = AquaPrimary.copy(alpha = 0.4f),
                            border = androidx.compose.foundation.BorderStroke(1.dp, AquaLight.copy(alpha = 0.5f))
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Celebration,
                                    contentDescription = "Event",
                                    tint = AquaPale,
                                    modifier = Modifier.size(14.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = if (isBn) "ইভেন্ট ও বিশেষ আয়োজন" else "Bulk & Event Orders",
                                    color = AquaPale,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }

                        Text(
                            text = "20L & 5L Bulk",
                            color = AquaLight,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // Big Headline
                    Text(
                        text = if (isBn) "বড় আয়োজন?\nপানির দায়িত্ব আমাদের।" else "Hosting a Big Event?\nLeave the Water to Us.",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Black,
                        color = PureWhite,
                        lineHeight = 28.sp
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = if (isBn)
                            "আপনার অনুষ্ঠান, মিলাদ, সভা, বিয়ে বা বিশেষ আয়োজনের জন্য প্রয়োজন অনুযায়ী ৫ লিটার ও ২০ লিটারের পানি সরবরাহ করা হয়।"
                        else
                            "From Milad Mehfils and wedding banquets to corporate conferences and social gatherings, we supply customized 5 Litre & 20 Litre purified drinking water with zero hassle.",
                        color = AquaIce,
                        fontSize = 13.sp,
                        lineHeight = 19.sp
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    // Highlights Row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        listOf(
                            if (isBn) "মিলাদ মাহফিল" else "Milad Mehfil",
                            if (isBn) "বিবাহ অনুষ্ঠান" else "Weddings",
                            if (isBn) "সেমিনার ও সভা" else "Conferences"
                        ).forEach { tag ->
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(Color(0xFF133658))
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text(
                                    text = "✓ $tag",
                                    color = AquaPale,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(18.dp))

                    // Actions Row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Button(
                            onClick = onEventOrderClick,
                            modifier = Modifier
                                .weight(1.2f)
                                .height(46.dp)
                                .testTag("event_order_button"),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = AquaLight,
                                contentColor = NavyDark
                            ),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.EventNote,
                                contentDescription = "Event Order",
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = if (isBn) "Event Order করুন" else "Book Event Order",
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp
                            )
                        }

                        OutlinedButton(
                            onClick = onCallClick,
                            modifier = Modifier
                                .weight(1f)
                                .height(46.dp)
                                .testTag("event_call_button"),
                            colors = ButtonDefaults.outlinedButtonColors(
                                contentColor = PureWhite
                            ),
                            shape = RoundedCornerShape(12.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, AquaPale)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Call,
                                contentDescription = "Call",
                                modifier = Modifier.size(16.dp),
                                tint = AquaPale
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "+8801711102448",
                                fontWeight = FontWeight.Bold,
                                fontSize = 11.sp,
                                color = PureWhite
                            )
                        }
                    }
                }
            }
        }
    }
}
