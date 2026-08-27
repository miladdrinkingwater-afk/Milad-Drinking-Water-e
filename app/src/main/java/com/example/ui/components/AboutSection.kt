package com.example.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.material.icons.filled.Business
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
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
import com.example.ui.theme.AquaDeep
import com.example.ui.theme.AquaIce
import com.example.ui.theme.AquaLight
import com.example.ui.theme.AquaPale
import com.example.ui.theme.AquaPrimary
import com.example.ui.theme.BstiGreen
import com.example.ui.theme.NavyDark
import com.example.ui.theme.NavyHeading
import com.example.ui.theme.PureWhite
import com.example.ui.theme.SlateGray

@Composable
fun AboutSection(
    language: AppLanguage,
    onLocationClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val isBn = language == AppLanguage.BN

    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(Color(0xFFF7FAFD))
            .padding(horizontal = 16.dp, vertical = 24.dp)
            .testTag("about_section")
    ) {
        // Section Header Pill & Title
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .background(AquaIce)
                    .padding(horizontal = 10.dp, vertical = 4.dp)
            ) {
                Text(
                    text = if (isBn) "আমাদের পরিচিতি" else "About Milad Water",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = AquaDeep
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = if (isBn) "বিশুদ্ধতার সঙ্গে আমাদের পথচলা" else "Our Legacy of Pure Hydration",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            color = NavyDark
        )

        Spacer(modifier = Modifier.height(10.dp))

        Text(
            text = if (isBn)
                "মিলাদ ড্রিংকিং ওয়াটার ২০০৬ সাল থেকে বিশুদ্ধ ও নিরাপদ পানির সরবরাহের মাধ্যমে সিলেটের মানুষের আস্থা অর্জনের লক্ষ্যে কাজ করে আসছে। মিরবক্সটুলা, সিলেট থেকে আমরা বাসাবাড়ি, অফিস এবং বিভিন্ন বিশেষ আয়োজনে প্রয়োজন অনুযায়ী বিশুদ্ধ পানি সরবরাহ করে থাকি।"
            else
                "Milad Drinking Water has been relentlessly dedicated to earning the trust of Sylhet residents since 2006 by providing 100% pure and hygienic drinking water. Operating from Mirboxtula, Sylhet, we supply premium water to households, corporate workplaces, and celebratory gatherings.",
            style = MaterialTheme.typography.bodyLarge,
            color = SlateGray,
            lineHeight = 22.sp
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Factory / Purification Visual Card
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .height(190.dp),
            shape = RoundedCornerShape(16.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
        ) {
            Box(modifier = Modifier.fillMaxSize()) {
                Image(
                    painter = painterResource(id = R.drawable.img_factory_purity),
                    contentDescription = "Hygienic Bottling Factory",
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop
                )

                // Dark gradient overlay
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.verticalGradient(
                                colors = listOf(
                                    Color.Transparent,
                                    NavyDark.copy(alpha = 0.85f)
                                ),
                                startY = 80f
                            )
                        )
                )

                // Factory info text
                Column(
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .padding(14.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.LocationOn,
                            contentDescription = "Factory Location",
                            tint = AquaLight,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = if (isBn) "ফ্যাক্টরি: মিরবক্সটুলা, সিলেট, বাংলাদেশ" else "Factory: Mirboxtula, Sylhet, Bangladesh",
                            color = PureWhite,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Text(
                        text = if (isBn) "আধুনিক ও স্বাস্থ্যসম্মত বোতলজাতকরণ ব্যবস্থা" else "Modern & Hygienic Bottling Facility",
                        color = AquaPale,
                        fontSize = 11.sp
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Official Trademark Brand Badge Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(14.dp),
            colors = CardDefaults.cardColors(containerColor = PureWhite),
            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE2EDF5))
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(14.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Image(
                    painter = painterResource(id = R.drawable.milad_official_logo),
                    contentDescription = "Milad Official Logo",
                    modifier = Modifier
                        .size(56.dp)
                        .clip(RoundedCornerShape(10.dp)),
                    contentScale = ContentScale.Fit
                )

                Spacer(modifier = Modifier.width(14.dp))

                Column {
                    Text(
                        text = if (isBn) "অফিসিয়াল ব্র্যান্ড লোগো" else "Official Brand Identity",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = AquaPrimary
                    )
                    Text(
                        text = "MILAD DRINKING WATER",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Black,
                        color = NavyDark,
                        letterSpacing = 0.5.sp
                    )
                    Text(
                        text = if (isBn) "সিলেটের বিশ্বস্ত বিশুদ্ধ পানি প্রস্তুতকারী ও সরবরাহকারী প্রতিষ্ঠান" else "Sylhet's Trusted Hygienic Drinking Water Bottler & Supplier",
                        fontSize = 11.sp,
                        color = SlateGray
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Key Leadership & Foundation Cards
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            // Founder / Owner Card
            Card(
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = PureWhite),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE2EDF5))
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Box(
                        modifier = Modifier
                            .size(32.dp)
                            .clip(CircleShape)
                            .background(AquaIce),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Person,
                            contentDescription = "Owner",
                            tint = AquaPrimary,
                            modifier = Modifier.size(18.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = if (isBn) "স্বত্বাধিকারী / প্রতিষ্ঠাতা" else "Proprietor / Founder",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Medium,
                        color = SlateGray
                    )

                    Text(
                        text = if (isBn) "হাজী মিলাদ আহমদ" else "Haji Milad Ahmad",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = NavyDark
                    )
                }
            }

            // Establishment Year Card
            Card(
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = PureWhite),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE2EDF5))
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Box(
                        modifier = Modifier
                            .size(32.dp)
                            .clip(CircleShape)
                            .background(Color(0xFFECFDF5)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Verified,
                            contentDescription = "BSTI",
                            tint = BstiGreen,
                            modifier = Modifier.size(18.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = if (isBn) "প্রতিষ্ঠাকাল ও সনদ" else "Established & Cert",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Medium,
                        color = SlateGray
                    )

                    Text(
                        text = if (isBn) "২০০৬ • BSTI Approved" else "2006 • BSTI Approved",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = BstiGreen
                    )
                }
            }
        }
    }
}
