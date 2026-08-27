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
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.EditNote
import androidx.compose.material.icons.filled.LocalShipping
import androidx.compose.material.icons.filled.PhoneInTalk
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
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
import com.example.ui.theme.NavyDark
import com.example.ui.theme.NavyHeading
import com.example.ui.theme.PureWhite
import com.example.ui.theme.SlateGray

data class ProcessStep(
    val number: String,
    val titleBn: String,
    val titleEn: String,
    val detailBn: String,
    val detailEn: String,
    val icon: androidx.compose.ui.graphics.vector.ImageVector
)

@Composable
fun OrderProcessSection(
    language: AppLanguage,
    onCallClick: () -> Unit,
    onOnlineOrderClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val isBn = language == AppLanguage.BN

    val steps = listOf(
        ProcessStep(
            number = "01",
            titleBn = "কল করুন বা ফর্ম পূরণ করুন",
            titleEn = "Call or Fill Form",
            detailBn = "আমাদের সাপোর্ট নম্বরে (+8801711102448) সরাসরি কল দিন অথবা অনলাইন ফর্ম দিয়ে দ্রুত রিকোয়েস্ট পাঠান।",
            detailEn = "Call our hotline +8801711102448 directly or submit the quick online delivery request form.",
            icon = Icons.Default.PhoneInTalk
        ),
        ProcessStep(
            number = "02",
            titleBn = "আপনার প্রয়োজন জানান",
            titleEn = "Specify Your Requirements",
            detailBn = "২০ লিটার জার বা ৫ লিটার বোতল, পরিমাণ এবং আপনার সিলেটের ডেলিভারি ঠিকানা জানান।",
            detailEn = "Select 20L Jar or 5L Bottle, choose required quantity, and provide your delivery address in Sylhet.",
            icon = Icons.Default.EditNote
        ),
        ProcessStep(
            number = "03",
            titleBn = "পানি গ্রহণ করুন",
            titleEn = "Receive Pure Water",
            detailBn = "আমাদের দ্রুত ডেলিভারি টিম নির্দিষ্ট সময়ে আপনার বাসা, অফিস বা অনুষ্ঠানে বিশুদ্ধ পানি পৌঁছে দেবে।",
            detailEn = "Our dedicated delivery logistics fleet delivers hygienically sealed pure water right to your doorstep.",
            icon = Icons.Default.LocalShipping
        )
    )

    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(PureWhite)
            .padding(horizontal = 16.dp, vertical = 24.dp)
            .testTag("order_process_section")
    ) {
        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(8.dp))
                .background(AquaIce)
                .padding(horizontal = 10.dp, vertical = 4.dp)
        ) {
            Text(
                text = if (isBn) "সহজ ৩টি ধাপ" else "Simple 3-Step Process",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = AquaDeep
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = if (isBn) "কীভাবে অর্ডার করবেন?" else "How to Order Pure Water",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            color = NavyDark
        )

        Text(
            text = if (isBn) "ঝামেলাহীন ও দ্রুত ডেলিভারির জন্য মাত্র ৩টি সহজ ধাপ" else "Effortless, reliable, and prompt doorstep delivery across Sylhet",
            style = MaterialTheme.typography.bodyMedium,
            color = SlateGray
        )

        Spacer(modifier = Modifier.height(18.dp))

        steps.forEachIndexed { index, step ->
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 5.dp),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFF9FBFC)),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE5EFF5))
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(48.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(AquaPrimary),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = step.number,
                                color = PureWhite,
                                fontWeight = FontWeight.Black,
                                fontSize = 16.sp
                            )
                        }
                    }

                    Spacer(modifier = Modifier.width(14.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = if (isBn) step.titleBn else step.titleEn,
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp,
                            color = NavyDark
                        )
                        Spacer(modifier = Modifier.height(3.dp))
                        Text(
                            text = if (isBn) step.detailBn else step.detailEn,
                            fontSize = 12.sp,
                            color = SlateGray,
                            lineHeight = 17.sp
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Quick CTA buttons
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Button(
                onClick = onOnlineOrderClick,
                modifier = Modifier
                    .weight(1f)
                    .height(44.dp),
                colors = ButtonDefaults.buttonColors(containerColor = AquaPrimary),
                shape = RoundedCornerShape(10.dp)
            ) {
                Text(
                    text = if (isBn) "অনলাইন অর্ডার করুন" else "Order Online",
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp
                )
            }

            Button(
                onClick = onCallClick,
                modifier = Modifier
                    .weight(1f)
                    .height(44.dp),
                colors = ButtonDefaults.buttonColors(containerColor = AquaIce, contentColor = AquaDeep),
                shape = RoundedCornerShape(10.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, AquaPale)
            ) {
                Icon(
                    imageVector = Icons.Default.Call,
                    contentDescription = "Call",
                    modifier = Modifier.size(16.dp),
                    tint = AquaDeep
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = if (isBn) "সরাসরি কল দিন" else "Call Directly",
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp
                )
            }
        }
    }
}
