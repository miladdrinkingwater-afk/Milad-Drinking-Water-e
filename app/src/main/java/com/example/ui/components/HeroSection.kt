package com.example.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.LocalShipping
import androidx.compose.material.icons.filled.ShoppingBag
import androidx.compose.material.icons.filled.Verified
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
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.R
import com.example.data.model.AppLanguage
import com.example.ui.theme.AquaDeep
import com.example.ui.theme.AquaIce
import com.example.ui.theme.AquaLight
import com.example.ui.theme.AquaPale
import com.example.ui.theme.AquaPrimary
import com.example.ui.theme.AquaSecondary
import com.example.ui.theme.BstiGreen
import com.example.ui.theme.NavyDark
import com.example.ui.theme.NavyHeading
import com.example.ui.theme.PureWhite

@Composable
fun HeroSection(
    language: AppLanguage,
    onOrderClick: () -> Unit,
    onAboutClick: () -> Unit,
    onCallClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val isBn = language == AppLanguage.BN

    Box(
        modifier = modifier
            .fillMaxWidth()
            .background(Color(0xFFF1F8FC))
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Trust Tag Pill
            Row(
                modifier = Modifier
                    .clip(RoundedCornerShape(20.dp))
                    .background(PureWhite)
                    .border(1.dp, AquaPale, RoundedCornerShape(20.dp))
                    .padding(horizontal = 12.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Verified,
                    contentDescription = "BSTI Verified",
                    tint = BstiGreen,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = if (isBn) "BSTI Approved • বিশ্বস্ত বিশুদ্ধ পানি" else "BSTI Approved • Verified Drinking Water",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = AquaDeep
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Main Hero Headline
            Text(
                text = if (isBn) "বিশুদ্ধ পানির\nনির্ভরযোগ্য ঠিকানা" else "Pure Water.\nTrusted Every Day.",
                style = MaterialTheme.typography.displayMedium,
                fontWeight = FontWeight.Black,
                color = NavyDark,
                textAlign = TextAlign.Center,
                lineHeight = 36.sp,
                modifier = Modifier.testTag("hero_headline")
            )

            Spacer(modifier = Modifier.height(10.dp))

            // Subheadline
            Text(
                text = if (isBn)
                    "২০০৬ সাল থেকে মিরবক্সটুলা, সিলেট থেকে বাসা, অফিস ও বিশেষ আয়োজনে সরবরাহ করছি বিশুদ্ধ পানির নির্ভরযোগ্য সেবা।"
                else
                    "Delivering pure, hygienic, and trusted drinking water across Sylhet homes, corporate offices, and special occasions since 2006 from Mirboxtula.",
                style = MaterialTheme.typography.bodyLarge,
                color = NavyHeading,
                textAlign = TextAlign.Center,
                lineHeight = 22.sp,
                modifier = Modifier.padding(horizontal = 8.dp)
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Hero Visual Card with Water Splash
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(210.dp),
                shape = RoundedCornerShape(20.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 6.dp)
            ) {
                Box(modifier = Modifier.fillMaxSize()) {
                    Image(
                        painter = painterResource(id = R.drawable.img_hero_water),
                        contentDescription = "Pure Water Hero",
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop
                    )

                    // Gradient overlay
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(
                                Brush.verticalGradient(
                                    colors = listOf(
                                        Color.Transparent,
                                        NavyDark.copy(alpha = 0.75f)
                                    ),
                                    startY = 100f
                                )
                            )
                    )

                    // Bottom info overlay inside hero card
                    Column(
                        modifier = Modifier
                            .align(Alignment.BottomStart)
                            .padding(16.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(AquaLight.copy(alpha = 0.9f))
                                    .padding(horizontal = 8.dp, vertical = 3.dp)
                            ) {
                                Text(
                                    text = if (isBn) "২০ লিটার জার" else "20L Jar",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = NavyDark
                                )
                            }

                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(PureWhite.copy(alpha = 0.9f))
                                    .padding(horizontal = 8.dp, vertical = 3.dp)
                            ) {
                                Text(
                                    text = if (isBn) "৫ লিটার বোতল" else "5L Bottle",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = AquaDeep
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(4.dp))

                        Text(
                            text = if (isBn) "হোম ডেলিভারি • অফিস সাপ্লাই • ইভেন্ট ও বাল্ক সার্ভিস" else "Home Delivery • Office Supply • Event Bulk Supply",
                            color = PureWhite,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // Action Buttons (Order & About)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Button(
                    onClick = onOrderClick,
                    modifier = Modifier
                        .weight(1.1f)
                        .height(50.dp)
                        .testTag("hero_primary_order_button"),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = AquaPrimary,
                        contentColor = PureWhite
                    ),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.ShoppingBag,
                        contentDescription = "Order",
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = if (isBn) "অর্ডার করুন" else "Order Now",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp
                    )
                }

                OutlinedButton(
                    onClick = onAboutClick,
                    modifier = Modifier
                        .weight(0.9f)
                        .height(50.dp)
                        .testTag("hero_secondary_about_button"),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.outlinedButtonColors(
                        contentColor = AquaDeep
                    ),
                    border = ButtonDefaults.outlinedButtonBorder.copy(
                        brush = Brush.horizontalGradient(listOf(AquaPrimary, AquaSecondary))
                    )
                ) {
                    Icon(
                        imageVector = Icons.Default.Info,
                        contentDescription = "About",
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = if (isBn) "আমাদের সম্পর্কে" else "About Us",
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 13.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Direct Call Highlight Banner
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .clickable { onCallClick() }
                    .testTag("hero_direct_call_bar"),
                color = AquaIce,
                border = androidx.compose.foundation.BorderStroke(1.dp, AquaPale)
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(32.dp)
                                .clip(CircleShape)
                                .background(AquaPrimary),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Call,
                                contentDescription = "Call",
                                tint = PureWhite,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                text = if (isBn) "সরাসরি ফোনে অর্ডার করতে কল করুন" else "Direct Phone Order & Support",
                                fontSize = 11.sp,
                                color = NavyHeading
                            )
                            Text(
                                text = "+8801711102448",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = AquaDeep
                            )
                        }
                    }

                    Text(
                        text = if (isBn) "ট্যাপ করুন" else "Tap to Dial",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = AquaPrimary
                    )
                }
            }
        }
    }
}
