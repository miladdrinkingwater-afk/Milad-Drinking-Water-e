package com.example.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
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
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material.icons.filled.WaterDrop
import androidx.compose.material3.Divider
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
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
import com.example.ui.theme.AquaIce
import com.example.ui.theme.AquaLight
import com.example.ui.theme.AquaPale
import com.example.ui.theme.AquaPrimary
import com.example.ui.theme.BstiGreen
import com.example.ui.theme.NavyDark
import com.example.ui.theme.PureWhite

@Composable
fun MiladFooter(
    language: AppLanguage,
    onSectionClick: (AppSection) -> Unit,
    onCallClick: () -> Unit,
    onEmailClick: () -> Unit,
    onMapClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val isBn = language == AppLanguage.BN

    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(NavyDark)
            .padding(horizontal = 16.dp, vertical = 28.dp)
            .testTag("footer_section")
    ) {
        // Logo & Tagline
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(PureWhite)
                    .padding(2.dp),
                contentAlignment = Alignment.Center
            ) {
                Image(
                    painter = painterResource(R.drawable.milad_official_logo),
                    contentDescription = "Milad Official Logo",
                    contentScale = ContentScale.Fit,
                    modifier = Modifier
                        .size(36.dp)
                        .clip(RoundedCornerShape(6.dp))
                )
            }
            Spacer(modifier = Modifier.width(10.dp))
            Column {
                Text(
                    text = "MILAD DRINKING WATER",
                    color = PureWhite,
                    fontWeight = FontWeight.Black,
                    fontSize = 15.sp,
                    letterSpacing = 1.sp
                )
                Text(
                    text = if (isBn) "বিশুদ্ধতার প্রতিশ্রুতি, প্রতিদিনের পানিতে" else "Pure Water. Trusted Every Day.",
                    color = AquaPale,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Medium
                )
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        // Quick Links Grid
        Text(
            text = if (isBn) "গুরুত্বপূর্ণ লিংকসমূহ" else "Quick Links",
            color = PureWhite,
            fontWeight = FontWeight.Bold,
            fontSize = 13.sp
        )

        Spacer(modifier = Modifier.height(8.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Text(
                    text = if (isBn) "• হোম" else "• Home",
                    color = AquaIce,
                    fontSize = 12.sp,
                    modifier = Modifier.clickable { onSectionClick(AppSection.HOME) }
                )
                Text(
                    text = if (isBn) "• ২০ লিটার ও ৫ লিটার পানি" else "• 20L & 5L Products",
                    color = AquaIce,
                    fontSize = 12.sp,
                    modifier = Modifier.clickable { onSectionClick(AppSection.PRODUCTS) }
                )
                Text(
                    text = if (isBn) "• হোম ও অফিস সার্ভিস" else "• Home & Office Services",
                    color = AquaIce,
                    fontSize = 12.sp,
                    modifier = Modifier.clickable { onSectionClick(AppSection.SERVICES) }
                )
            }

            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Text(
                    text = if (isBn) "• ইভেন্ট ও বাল্ক সাপ্লাই" else "• Event & Bulk Supply",
                    color = AquaIce,
                    fontSize = 12.sp,
                    modifier = Modifier.clickable { onSectionClick(AppSection.BULK_EVENT) }
                )
                Text(
                    text = if (isBn) "• BSTI অনুমোদন ও মান" else "• BSTI Quality",
                    color = AquaIce,
                    fontSize = 12.sp,
                    modifier = Modifier.clickable { onSectionClick(AppSection.QUALITY) }
                )
                Text(
                    text = if (isBn) "• যোগাযোগ ও ফ্যাক্টরি" else "• Contact & Factory",
                    color = AquaIce,
                    fontSize = 12.sp,
                    modifier = Modifier.clickable { onSectionClick(AppSection.CONTACT) }
                )
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        HorizontalDivider(color = Color(0xFF1B3B5F), thickness = 0.8.dp)

        Spacer(modifier = Modifier.height(14.dp))

        // Direct Contact Info Bar
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.clickable { onCallClick() }
            ) {
                Icon(
                    imageVector = Icons.Default.Call,
                    contentDescription = null,
                    tint = AquaLight,
                    modifier = Modifier.size(14.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "+8801711102448",
                    color = PureWhite,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.clickable { onEmailClick() }
            ) {
                Icon(
                    imageVector = Icons.Default.Email,
                    contentDescription = null,
                    tint = AquaLight,
                    modifier = Modifier.size(14.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "miladdrinkingwater@gmail.com",
                    color = AquaIce,
                    fontSize = 12.sp
                )
            }

            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.clickable { onMapClick() }
            ) {
                Icon(
                    imageVector = Icons.Default.LocationOn,
                    contentDescription = null,
                    tint = AquaLight,
                    modifier = Modifier.size(14.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = if (isBn) "মিরবক্সটুলা, সিলেট, বাংলাদেশ" else "Mirboxtula, Sylhet, Bangladesh",
                    color = AquaIce,
                    fontSize = 12.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        HorizontalDivider(color = Color(0xFF1B3B5F), thickness = 0.8.dp)

        Spacer(modifier = Modifier.height(12.dp))

        // Copyright and BSTI Tag
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "© 2026 Milad Drinking Water",
                color = Color(0xFF88A4C2),
                fontSize = 11.sp
            )

            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.Verified,
                    contentDescription = null,
                    tint = BstiGreen,
                    modifier = Modifier.size(12.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = "BSTI Approved",
                    color = Color(0xFF86EFAC),
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }
        
        Spacer(modifier = Modifier.height(60.dp)) // Extra space for persistent floating bottom bar
    }
}
