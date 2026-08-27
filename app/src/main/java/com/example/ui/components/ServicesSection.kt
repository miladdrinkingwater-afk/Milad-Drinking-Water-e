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
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Business
import androidx.compose.material.icons.filled.Celebration
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Loop
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.AppLanguage
import com.example.data.model.DeliveryServiceType
import com.example.data.model.ServiceInfo
import com.example.ui.theme.AquaDeep
import com.example.ui.theme.AquaIce
import com.example.ui.theme.AquaLight
import com.example.ui.theme.AquaPale
import com.example.ui.theme.AquaPrimary
import com.example.ui.theme.AquaSecondary
import com.example.ui.theme.NavyDark
import com.example.ui.theme.NavyHeading
import com.example.ui.theme.PureWhite
import com.example.ui.theme.SlateGray

@Composable
fun ServicesSection(
    language: AppLanguage,
    services: List<ServiceInfo>,
    onSelectService: (DeliveryServiceType) -> Unit,
    modifier: Modifier = Modifier
) {
    val isBn = language == AppLanguage.BN

    val serviceIcons = mapOf(
        DeliveryServiceType.HOME_DELIVERY to Icons.Default.Home,
        DeliveryServiceType.OFFICE_DELIVERY to Icons.Default.Business,
        DeliveryServiceType.EVENT_SUPPLY to Icons.Default.Celebration,
        DeliveryServiceType.REGULAR_SUPPLY to Icons.Default.Loop
    )

    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(Color(0xFFF3F9FC))
            .padding(horizontal = 16.dp, vertical = 24.dp)
            .testTag("services_section")
    ) {
        // Badge & Title
        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(8.dp))
                .background(AquaIce)
                .padding(horizontal = 10.dp, vertical = 4.dp)
        ) {
            Text(
                text = if (isBn) "আমাদের সেবাসমূহ" else "Core Services",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = AquaDeep
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = if (isBn) "যেখানে প্রয়োজন, সেখানেই পানি" else "Pure Water, Wherever You Need",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            color = NavyDark
        )

        Text(
            text = if (isBn) "সিলেট মহানগরীর যেকোনো স্থানে বাসা, অফিস ও সামাজিক অনুষ্ঠানের নির্ভরযোগ্য পানি সরবরাহ" else "Dedicated and scheduled drinking water supply for homes, corporate offices, and grand occasions across Sylhet",
            style = MaterialTheme.typography.bodyMedium,
            color = SlateGray
        )

        Spacer(modifier = Modifier.height(16.dp))

        services.forEach { service ->
            val icon = serviceIcons[service.id] ?: Icons.Default.Home

            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 6.dp)
                    .testTag("service_card_${service.id.name.lowercase()}"),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = PureWhite),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE2EDF4))
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(42.dp)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(
                                        Brush.linearGradient(listOf(AquaPrimary, AquaLight))
                                    ),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = icon,
                                    contentDescription = service.titleEn,
                                    tint = PureWhite,
                                    modifier = Modifier.size(22.dp)
                                )
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            Column {
                                Text(
                                    text = if (isBn) service.titleBn else service.titleEn,
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold,
                                    color = NavyDark
                                )
                                Text(
                                    text = if (isBn) service.subtitleBn else service.subtitleEn,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Medium,
                                    color = AquaDeep
                                )
                            }
                        }

                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = AquaIce
                        ) {
                            Text(
                                text = if (isBn) service.badgeBn else service.badgeEn,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = AquaPrimary,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = if (isBn) service.descBn else service.descEn,
                        style = MaterialTheme.typography.bodyMedium,
                        color = SlateGray,
                        lineHeight = 18.sp
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Button(
                        onClick = { onSelectService(service.id) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(42.dp)
                            .testTag("service_cta_${service.id.name.lowercase()}"),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = AquaIce,
                            contentColor = AquaDeep
                        ),
                        shape = RoundedCornerShape(10.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, AquaPale)
                    ) {
                        Text(
                            text = if (isBn) service.ctaBn else service.ctaEn,
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Icon(
                            imageVector = Icons.Default.ArrowForward,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp),
                            tint = AquaDeep
                        )
                    }
                }
            }
        }
    }
}
