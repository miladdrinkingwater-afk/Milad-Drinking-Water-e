package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
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
import androidx.compose.material.icons.filled.AccessTime
import androidx.compose.material.icons.filled.Business
import androidx.compose.material.icons.filled.Celebration
import androidx.compose.material.icons.filled.DeliveryDining
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material.icons.filled.WaterDrop
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.AppLanguage
import com.example.data.model.TrustItem
import com.example.ui.theme.AquaDeep
import com.example.ui.theme.AquaIce
import com.example.ui.theme.AquaPrimary
import com.example.ui.theme.BstiGreen
import com.example.ui.theme.NavyDark
import com.example.ui.theme.NavyHeading
import com.example.ui.theme.PureWhite
import com.example.ui.theme.SlateGray

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun WhyChooseUsSection(
    language: AppLanguage,
    features: List<TrustItem>,
    modifier: Modifier = Modifier
) {
    val isBn = language == AppLanguage.BN

    val featureIcons = listOf(
        Icons.Default.AccessTime,
        Icons.Default.Verified,
        Icons.Default.WaterDrop,
        Icons.Default.Home,
        Icons.Default.Business,
        Icons.Default.Celebration
    )

    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(Color(0xFFF7FAFC))
            .padding(horizontal = 16.dp, vertical = 24.dp)
            .testTag("why_choose_us_section")
    ) {
        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(8.dp))
                .background(AquaIce)
                .padding(horizontal = 10.dp, vertical = 4.dp)
        ) {
            Text(
                text = if (isBn) "আমাদের বিশেষত্ব" else "Why Choose Us",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = AquaDeep
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = if (isBn) "কেন মিলাদ ড্রিংকিং ওয়াটার?" else "Why Choose Milad Drinking Water?",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            color = NavyDark
        )

        Text(
            text = if (isBn) "সিলেটের প্রতিটি পরিবার ও প্রতিষ্ঠানের আস্থার অন্যতম নির্ভরযোগ্য নাম" else "The trusted name for households, corporate organizations, and events throughout Sylhet",
            style = MaterialTheme.typography.bodyMedium,
            color = SlateGray
        )

        Spacer(modifier = Modifier.height(16.dp))

        FlowRow(
            modifier = Modifier.fillMaxWidth(),
            maxItemsInEachRow = 2,
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            features.forEachIndexed { index, feature ->
                val icon = featureIcons.getOrElse(index) { Icons.Default.WaterDrop }

                Card(
                    modifier = Modifier
                        .weight(1f)
                        .height(130.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = PureWhite),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE2EDF4)),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        verticalArrangement = Arrangement.Top
                    ) {
                        Box(
                            modifier = Modifier
                                .size(32.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(if (index == 1) Color(0xFFECFDF5) else AquaIce),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = icon,
                                contentDescription = feature.titleEn,
                                tint = if (index == 1) BstiGreen else AquaPrimary,
                                modifier = Modifier.size(18.dp)
                            )
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = if (isBn) feature.titleBn else feature.titleEn,
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp,
                            color = NavyDark
                        )

                        Spacer(modifier = Modifier.height(2.dp))

                        Text(
                            text = if (isBn) feature.subtitleBn else feature.subtitleEn,
                            fontSize = 11.sp,
                            color = SlateGray,
                            lineHeight = 15.sp,
                            maxLines = 2
                        )
                    }
                }
            }
        }
    }
}
