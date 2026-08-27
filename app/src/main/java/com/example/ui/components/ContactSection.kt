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
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Send
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
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
import com.example.ui.theme.BstiGreen
import com.example.ui.theme.NavyDark
import com.example.ui.theme.NavyHeading
import com.example.ui.theme.PureWhite
import com.example.ui.theme.SlateGray

@Composable
fun ContactSection(
    language: AppLanguage,
    onCallClick: () -> Unit,
    onEmailClick: () -> Unit,
    onMapClick: () -> Unit,
    onSendMessage: (String, String, String) -> Unit,
    modifier: Modifier = Modifier
) {
    val isBn = language == AppLanguage.BN

    var contactName by remember { mutableStateOf("") }
    var contactPhone by remember { mutableStateOf("") }
    var contactMsg by remember { mutableStateOf("") }
    var submitted by remember { mutableStateOf(false) }

    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(Color(0xFFF7FAFD))
            .padding(horizontal = 16.dp, vertical = 24.dp)
            .testTag("contact_section")
    ) {
        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(8.dp))
                .background(AquaIce)
                .padding(horizontal = 10.dp, vertical = 4.dp)
        ) {
            Text(
                text = if (isBn) "যোগাযোগ করুন" else "Contact Information",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = AquaDeep
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = if (isBn) "আমাদের সাথে যোগাযোগ" else "Get in Touch with Us",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            color = NavyDark
        )

        Text(
            text = if (isBn) "সিলেটে বিশুদ্ধ পানির যেকোনো তথ্য বা নিয়মিত সরবরাহের জন্য আমাদের কল অথবা ইমেইল করুন" else "For regular water orders, corporate contracts, or inquiries in Sylhet, feel free to call or email us anytime.",
            style = MaterialTheme.typography.bodyMedium,
            color = SlateGray
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Official Contact Details Cards
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = PureWhite),
            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE2EDF4)),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Brand and Owner
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(CircleShape)
                            .background(AquaIce),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Person,
                            contentDescription = null,
                            tint = AquaPrimary,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = if (isBn) "প্রতিষ্ঠান ও স্বত্বাধিকারী" else "Company & Proprietor",
                            fontSize = 11.sp,
                            color = SlateGray
                        )
                        Text(
                            text = if (isBn) "মিলাদ ড্রিংকিং ওয়াটার (হাজী মিলাদ আহমদ)" else "Milad Drinking Water (Haji Milad Ahmad)",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = NavyDark
                        )
                    }
                }

                // Phone (Clickable)
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(10.dp))
                        .clickable { onCallClick() }
                        .background(Color(0xFFF1F8FC))
                        .padding(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(CircleShape)
                            .background(AquaPrimary),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Call,
                            contentDescription = null,
                            tint = PureWhite,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = if (isBn) "অর্ডার ও কাস্টমার সাপোর্ট ফোন" else "Order & Customer Hotline",
                            fontSize = 11.sp,
                            color = SlateGray
                        )
                        Text(
                            text = "+8801711102448",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = AquaDeep
                        )
                    }
                    Text(
                        text = if (isBn) "কল দিন" else "Call",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = AquaPrimary,
                        modifier = Modifier.padding(end = 4.dp)
                    )
                }

                // Email (Clickable)
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(10.dp))
                        .clickable { onEmailClick() }
                        .background(Color(0xFFF1F8FC))
                        .padding(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(CircleShape)
                            .background(AquaSecondary),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Email,
                            contentDescription = null,
                            tint = PureWhite,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = if (isBn) "অফিশিয়াল ইমেইল" else "Official Email",
                            fontSize = 11.sp,
                            color = SlateGray
                        )
                        Text(
                            text = "miladdrinkingwater@gmail.com",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = NavyDark
                        )
                    }
                    Text(
                        text = if (isBn) "মেইল পাঠান" else "Email",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = AquaPrimary,
                        modifier = Modifier.padding(end = 4.dp)
                    )
                }

                // Factory Address & Map Launcher
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(10.dp))
                        .clickable { onMapClick() }
                        .background(Color(0xFFF1F8FC))
                        .padding(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(CircleShape)
                            .background(BstiGreen),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.LocationOn,
                            contentDescription = null,
                            tint = PureWhite,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = if (isBn) "ফ্যাক্টরি ও অফিস ঠিকানা" else "Factory & Office Address",
                            fontSize = 11.sp,
                            color = SlateGray
                        )
                        Text(
                            text = if (isBn) "মিরবক্সটুলা, সিলেট, বাংলাদেশ" else "Mirboxtula, Sylhet, Bangladesh",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = NavyDark
                        )
                    }
                    Text(
                        text = if (isBn) "ম্যাপ দেখুন" else "View Map",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = BstiGreen,
                        modifier = Modifier.padding(end = 4.dp)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        // Quick Message / Feedback Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = PureWhite),
            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE2EDF4))
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                Text(
                    text = if (isBn) "দ্রুত বার্তা পাঠান" else "Send a Quick Inquiry",
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp,
                    color = NavyDark
                )

                Spacer(modifier = Modifier.height(10.dp))

                OutlinedTextField(
                    value = contactName,
                    onValueChange = { contactName = it },
                    label = { Text(if (isBn) "আপনার নাম" else "Your Name") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("contact_input_name"),
                    shape = RoundedCornerShape(10.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = AquaPrimary,
                        unfocusedBorderColor = Color(0xFFD0E3EF)
                    ),
                    singleLine = true
                )

                Spacer(modifier = Modifier.height(8.dp))

                OutlinedTextField(
                    value = contactPhone,
                    onValueChange = { contactPhone = it },
                    label = { Text(if (isBn) "মোবাইল নম্বর" else "Mobile Number") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("contact_input_phone"),
                    shape = RoundedCornerShape(10.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = AquaPrimary,
                        unfocusedBorderColor = Color(0xFFD0E3EF)
                    ),
                    singleLine = true
                )

                Spacer(modifier = Modifier.height(8.dp))

                OutlinedTextField(
                    value = contactMsg,
                    onValueChange = { contactMsg = it },
                    label = { Text(if (isBn) "আপনার বার্তা / ঠিকানা / পানির চাহিদা" else "Your Message / Details") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(100.dp)
                        .testTag("contact_input_message"),
                    shape = RoundedCornerShape(10.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = AquaPrimary,
                        unfocusedBorderColor = Color(0xFFD0E3EF)
                    ),
                    maxLines = 3
                )

                Spacer(modifier = Modifier.height(12.dp))

                Button(
                    onClick = {
                        if (contactPhone.isNotBlank()) {
                            onSendMessage(contactName, contactPhone, contactMsg)
                            contactName = ""
                            contactPhone = ""
                            contactMsg = ""
                            submitted = true
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(44.dp)
                        .testTag("contact_submit_button"),
                    colors = ButtonDefaults.buttonColors(containerColor = AquaPrimary),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Send,
                        contentDescription = "Send",
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = if (isBn) "বার্তা পাঠান" else "Send Inquiry",
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp
                    )
                }

                if (submitted) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = if (isBn) "✓ আপনার বার্তা গৃহীত হয়েছে! আমরা দ্রুত কল করছি।" else "✓ Thank you! We will reach out to your number promptly.",
                        color = BstiGreen,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }
    }
}
