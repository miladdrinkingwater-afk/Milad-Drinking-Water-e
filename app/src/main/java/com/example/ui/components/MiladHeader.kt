package com.example.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Language
import androidx.compose.material.icons.filled.WaterDrop
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.R
import com.example.data.model.AppLanguage
import com.example.ui.AppSection
import com.example.ui.theme.AquaDeep
import com.example.ui.theme.AquaIce
import com.example.ui.theme.AquaLight
import com.example.ui.theme.AquaPale
import com.example.ui.theme.AquaPrimary
import com.example.ui.theme.AquaSecondary
import com.example.ui.theme.NavyDark
import com.example.ui.theme.NavyHeading
import com.example.ui.theme.PureWhite

@Composable
fun MiladHeader(
    language: AppLanguage,
    currentSection: AppSection,
    orderCount: Int,
    onLanguageToggle: () -> Unit,
    onSectionClick: (AppSection) -> Unit,
    onCallClick: () -> Unit,
    onOrderHistoryClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val isBn = language == AppLanguage.BN

    Surface(
        modifier = modifier.fillMaxWidth(),
        color = PureWhite,
        shadowElevation = 4.dp
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .statusBarsPadding()
        ) {
            // Top announcement & trust mini bar
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        Brush.horizontalGradient(
                            listOf(AquaDeep, AquaPrimary, AquaSecondary)
                        )
                    )
                    .padding(horizontal = 16.dp, vertical = 4.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(6.dp)
                                .clip(CircleShape)
                                .background(Color(0xFF34D399))
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = if (isBn) "BSTI অনুমোদিত • ২০০৬ সাল থেকে মিরবক্সটুলা, সিলেট" else "BSTI Approved • Since 2006 • Mirboxtula, Sylhet",
                            color = PureWhite,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium
                        )
                    }

                    Text(
                        text = "+8801711102448",
                        color = AquaPale,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.clickable { onCallClick() }
                    )
                }
            }

            // Main Brand Navigation Bar
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 10.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Logo & Brand Name
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clickable { onSectionClick(AppSection.HOME) }
                        .testTag("brand_logo_header")
                ) {
                    Box(
                        modifier = Modifier
                            .size(42.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(Color.White)
                            .border(1.dp, Color(0xFFE2E8F0), RoundedCornerShape(10.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Image(
                            painter = painterResource(R.drawable.milad_official_logo),
                            contentDescription = "Milad Drinking Water Official Logo",
                            contentScale = ContentScale.Fit,
                            modifier = Modifier
                                .size(38.dp)
                                .clip(RoundedCornerShape(8.dp))
                        )
                    }

                    Spacer(modifier = Modifier.width(10.dp))

                    Column {
                        Text(
                            text = "MILAD",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Black,
                            color = NavyDark,
                            letterSpacing = 1.5.sp,
                            fontSize = 16.sp
                        )
                        Text(
                            text = if (isBn) "ড্রিংকিং ওয়াটার" else "DRINKING WATER",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold,
                            color = AquaPrimary,
                            fontSize = 10.sp,
                            letterSpacing = 0.5.sp
                        )
                    }
                }

                // Action Buttons: Language toggle, Orders Tracker, Call CTA
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    // Language Switch Pill
                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = AquaIce,
                        modifier = Modifier
                            .clip(RoundedCornerShape(16.dp))
                            .clickable { onLanguageToggle() }
                            .testTag("language_toggle_button")
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.Language,
                                contentDescription = "Language",
                                tint = AquaPrimary,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = if (isBn) "English" else "বাংলা",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = AquaPrimary
                            )
                        }
                    }

                    // Order History / My Orders button with badge
                    IconButton(
                        onClick = { onOrderHistoryClick() },
                        modifier = Modifier
                            .size(36.dp)
                            .testTag("order_history_button")
                    ) {
                        BadgedBox(
                            badge = {
                                if (orderCount > 0) {
                                    Badge(
                                        containerColor = AquaPrimary,
                                        contentColor = PureWhite
                                    ) {
                                        Text("$orderCount", fontSize = 10.sp)
                                    }
                                }
                            }
                        ) {
                            Icon(
                                imageVector = Icons.Default.History,
                                contentDescription = "Order History",
                                tint = NavyHeading,
                                modifier = Modifier.size(22.dp)
                            )
                        }
                    }

                    // Compact Call CTA
                    Button(
                        onClick = onCallClick,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = AquaPrimary,
                            contentColor = PureWhite
                        ),
                        shape = RoundedCornerShape(20.dp),
                        contentPadding = androidx.compose.foundation.layout.PaddingValues(
                            horizontal = 12.dp,
                            vertical = 6.dp
                        ),
                        modifier = Modifier
                            .height(36.dp)
                            .testTag("header_call_button")
                    ) {
                        Icon(
                            imageVector = Icons.Default.Call,
                            contentDescription = "Call",
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = if (isBn) "কল করুন" else "Call",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            // Horizontal Scroll Navigation Tab Row
            val navItems = listOf(
                Pair(AppSection.HOME, if (isBn) "হোম" else "Home"),
                Pair(AppSection.PRODUCTS, if (isBn) "আমাদের পানি (20L/5L)" else "Products (20L/5L)"),
                Pair(AppSection.SERVICES, if (isBn) "সার্ভিস" else "Services"),
                Pair(AppSection.BULK_EVENT, if (isBn) "ইভেন্ট সাপ্লাই" else "Event Supply"),
                Pair(AppSection.QUALITY, if (isBn) "BSTI ও মান" else "Quality & BSTI"),
                Pair(AppSection.ABOUT, if (isBn) "আমাদের সম্পর্কে" else "About Us"),
                Pair(AppSection.ORDER_HOW, if (isBn) "অর্ডার পদ্ধতি" else "How to Order"),
                Pair(AppSection.CONTACT, if (isBn) "যোগাযোগ" else "Contact")
            )

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFFF9FBFC))
                    .border(
                        width = 0.5.dp,
                        color = Color(0xFFE2EDF3)
                    )
                    .horizontalScroll(rememberScrollState())
                    .padding(horizontal = 12.dp, vertical = 6.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                navItems.forEach { (section, label) ->
                    val isSelected = currentSection == section
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(if (isSelected) AquaPrimary else Color.Transparent)
                            .clickable { onSectionClick(section) }
                            .padding(horizontal = 12.dp, vertical = 6.dp)
                            .testTag("nav_tab_${section.name.lowercase()}")
                    ) {
                        Text(
                            text = label,
                            fontSize = 12.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                            color = if (isSelected) PureWhite else NavyHeading
                        )
                    }
                }
            }
        }
    }
}
