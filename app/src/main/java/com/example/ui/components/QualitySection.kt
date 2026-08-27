package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.material.icons.filled.CleanHands
import androidx.compose.material.icons.filled.HealthAndSafety
import androidx.compose.material.icons.filled.Sanitizer
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material.icons.filled.WaterDrop
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.AppLanguage
import com.example.ui.theme.AquaDeep
import com.example.ui.theme.AquaIce
import com.example.ui.theme.AquaLight
import com.example.ui.theme.AquaPrimary
import com.example.ui.theme.BstiGreen
import com.example.ui.theme.NavyDark
import com.example.ui.theme.NavyHeading
import com.example.ui.theme.PureWhite
import com.example.ui.theme.SlateGray

data class QualityItem(
    val icon: ImageVector,
    val titleBn: String,
    val titleEn: String,
    val descBn: String,
    val descEn: String
)

@Composable
fun QualitySection(
    language: AppLanguage,
    modifier: Modifier = Modifier
) {
    val isBn = language == AppLanguage.BN

    val qualityItems = listOf(
        QualityItem(
            icon = Icons.Default.Verified,
            titleBn = "BSTI অনুমোদিত মান",
            titleEn = "BSTI Certified Standards",
            descBn = "জাতীয় মান ও নিয়ন্ত্রণ সংস্থার অনুমোদিত নির্দেশিকা অনুযায়ী কঠোর মান নিয়ন্ত্রণ।",
            descEn = "Fully compliant with official BSTI certified drinking water protocols and regulations."
        ),
        QualityItem(
            icon = Icons.Default.WaterDrop,
            titleBn = "বিশুদ্ধ ও নিরাপদ পানি",
            titleEn = "Pure & Safe Hydration",
            descBn = "প্রতিটি ফোঁটায় সর্বোচ্চ নিরাপত্তা, স্বাদ ও বিশুদ্ধতার নিশ্চয়তা।",
            descEn = "Guaranteed pristine clarity, refreshing natural taste, and family-safe hygiene in every drop."
        ),
        QualityItem(
            icon = Icons.Default.Sanitizer,
            titleBn = "হাইজিনিক সিলিং ও প্যাকেজিং",
            titleEn = "Hygienic Packaging",
            descBn = "ধূলাবালি ও দূষণমুক্ত স্বয়ংক্রিয় প্রক্রিয়ায় বোতলজাতকরণ ও সিলিং।",
            descEn = "Contaminant-free automated bottling and leak-proof safety sealing for total peace of mind."
        ),
        QualityItem(
            icon = Icons.Default.HealthAndSafety,
            titleBn = "নিয়মিত কোয়ালিটি পর্যবেক্ষণ",
            titleEn = "Continuous Quality Monitoring",
            descBn = "গ্রাহকদের নিরাপদ পানি সরবরাহের জন্য সার্বক্ষণিক পরিষ্কার-পরিচ্ছন্নতা বজায় রাখা।",
            descEn = "Uncompromising cleanliness routines across storage, handling, and logistics."
        )
    )

    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(PureWhite)
            .padding(horizontal = 16.dp, vertical = 24.dp)
            .testTag("quality_section")
    ) {
        // Tag & Header
        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(8.dp))
                .background(Color(0xFFECFDF5))
                .padding(horizontal = 10.dp, vertical = 4.dp)
        ) {
            Text(
                text = if (isBn) "কোয়ালিটি ও সার্টিফিকেশন" else "Quality & Certification",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = BstiGreen
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = if (isBn) "বিশুদ্ধতা আমাদের অঙ্গীকার" else "Purity is Our Sacred Commitment",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            color = NavyDark
        )

        Text(
            text = if (isBn)
                "Milad Drinking Water-এর মূল লক্ষ্য হলো customers-এর কাছে বিশুদ্ধ ও নিরাপদ পানির নির্ভরযোগ্য সরবরাহ নিশ্চিত করা।"
            else
                "Milad Drinking Water's foremost mission is to consistently deliver pristine, safe, and dependable drinking water to our valued customers in Sylhet.",
            style = MaterialTheme.typography.bodyMedium,
            color = SlateGray,
            lineHeight = 20.sp
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Prominent BSTI Trust Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFFF0FDF4)),
            border = androidx.compose.foundation.BorderStroke(1.5.dp, Color(0xFF86EFAC))
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(54.dp)
                        .clip(CircleShape)
                        .background(BstiGreen),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Verified,
                        contentDescription = "BSTI Approved",
                        tint = PureWhite,
                        modifier = Modifier.size(32.dp)
                    )
                }

                Spacer(modifier = Modifier.width(14.dp))

                Column {
                    Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = BstiGreen
                    ) {
                        Text(
                            text = "OFFICIALLY CERTIFIED",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            color = PureWhite,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = "BSTI Approved Brand",
                        fontWeight = FontWeight.Black,
                        fontSize = 16.sp,
                        color = Color(0xFF065F46)
                    )

                    Text(
                        text = if (isBn) "বাংলাদেশ স্ট্যান্ডার্ডস অ্যান্ড টেস্টিং ইনস্টিটিউশন অনুমোদিত" else "Bangladesh Standards and Testing Institution Certified",
                        fontSize = 11.sp,
                        color = Color(0xFF047857)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // 4 Quality Pillars Grid
        qualityItems.forEach { item ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 6.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(AquaIce)
                    .padding(12.dp),
                verticalAlignment = Alignment.Top
            ) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(AquaPrimary),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = item.icon,
                        contentDescription = item.titleEn,
                        tint = PureWhite,
                        modifier = Modifier.size(20.dp)
                    )
                }

                Spacer(modifier = Modifier.width(12.dp))

                Column {
                    Text(
                        text = if (isBn) item.titleBn else item.titleEn,
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        color = NavyDark
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = if (isBn) item.descBn else item.descEn,
                        fontSize = 12.sp,
                        color = SlateGray,
                        lineHeight = 17.sp
                    )
                }
            }
        }
    }
}
