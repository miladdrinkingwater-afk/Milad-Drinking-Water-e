package com.example.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.LocalShipping
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material.icons.filled.Send
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material.icons.filled.WaterDrop
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
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
import com.example.data.model.DeliveryFrequency
import com.example.data.model.DeliveryServiceType
import com.example.data.model.WaterProductType
import com.example.ui.OrderFormState
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

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun OrderBottomSheet(
    formState: OrderFormState,
    language: AppLanguage,
    sylhetAreas: List<String>,
    onCustomerNameChange: (String) -> Unit,
    onPhoneChange: (String) -> Unit,
    onAreaChange: (String) -> Unit,
    onAddressChange: (String) -> Unit,
    onJar20QtyChange: (Int) -> Unit,
    onBottle5QtyChange: (Int) -> Unit,
    onServiceTypeChange: (DeliveryServiceType) -> Unit,
    onFrequencyChange: (DeliveryFrequency) -> Unit,
    onNotesChange: (String) -> Unit,
    onSubmit: () -> Unit,
    onCallDirect: () -> Unit,
    onDismiss: () -> Unit
) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val isBn = language == AppLanguage.BN
    var areaDropdownExpanded by remember { mutableStateOf(false) }

    if (formState.isOpen) {
        ModalBottomSheet(
            onDismissRequest = onDismiss,
            sheetState = sheetState,
            containerColor = PureWhite,
            dragHandle = null
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState())
                    .padding(horizontal = 20.dp, vertical = 16.dp)
                    .navigationBarsPadding()
                    .testTag("order_bottom_sheet")
            ) {
                // Header with close button
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(38.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(PureWhite)
                                .border(1.dp, Color(0xFFE2E8F0), RoundedCornerShape(8.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Image(
                                painter = painterResource(R.drawable.milad_official_logo),
                                contentDescription = "Milad Official Logo",
                                contentScale = ContentScale.Fit,
                                modifier = Modifier
                                    .size(34.dp)
                                    .clip(RoundedCornerShape(6.dp))
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                text = if (isBn) "বিশুদ্ধ পানির অর্ডার ফর্ম" else "Pure Water Order Request",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Bold,
                                color = NavyDark
                            )
                            Text(
                                text = if (isBn) "সিলেট মহানগরী • BSTI Approved" else "Sylhet City • BSTI Approved",
                                fontSize = 11.sp,
                                color = BstiGreen,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }

                    IconButton(
                        onClick = onDismiss,
                        modifier = Modifier.size(32.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Close",
                            tint = SlateGray
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Products Selector (20L and 5L)
                Text(
                    text = if (isBn) "১. পানির পরিমাণ নির্বাচন করুন" else "1. Select Water Quantity",
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = NavyDark
                )

                Spacer(modifier = Modifier.height(10.dp))

                // 20 Litre Jar Card
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = if (formState.jar20LQty > 0) AquaIce else Color(0xFFF8FAFC)
                    ),
                    border = androidx.compose.foundation.BorderStroke(
                        1.dp,
                        if (formState.jar20LQty > 0) AquaPrimary else Color(0xFFE2E8F0)
                    )
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = if (isBn) "২০ লিটার জার (20L Jar)" else "20 Litre Jar",
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp,
                                color = NavyDark
                            )
                            Text(
                                text = if (isBn) "বাসা ও অফিসের ডিসপেনসারের জন্য" else "For home & office dispensers",
                                fontSize = 11.sp,
                                color = SlateGray
                            )
                        }

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Surface(
                                shape = CircleShape,
                                color = PureWhite,
                                shadowElevation = 1.dp,
                                modifier = Modifier
                                    .size(32.dp)
                                    .clip(CircleShape)
                                    .clickable { onJar20QtyChange(formState.jar20LQty - 1) }
                                    .testTag("sheet_minus_20l")
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Icon(
                                        imageVector = Icons.Default.Remove,
                                        contentDescription = "Minus",
                                        tint = AquaDeep,
                                        modifier = Modifier.size(16.dp)
                                    )
                                }
                            }

                            Text(
                                text = "${formState.jar20LQty}",
                                fontWeight = FontWeight.Bold,
                                fontSize = 15.sp,
                                color = NavyDark,
                                modifier = Modifier.padding(horizontal = 14.dp)
                            )

                            Surface(
                                shape = CircleShape,
                                color = AquaPrimary,
                                shadowElevation = 1.dp,
                                modifier = Modifier
                                    .size(32.dp)
                                    .clip(CircleShape)
                                    .clickable { onJar20QtyChange(formState.jar20LQty + 1) }
                                    .testTag("sheet_plus_20l")
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Icon(
                                        imageVector = Icons.Default.Add,
                                        contentDescription = "Plus",
                                        tint = PureWhite,
                                        modifier = Modifier.size(16.dp)
                                    )
                                }
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // 5 Litre Bottle Card
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = if (formState.bottle5LQty > 0) AquaIce else Color(0xFFF8FAFC)
                    ),
                    border = androidx.compose.foundation.BorderStroke(
                        1.dp,
                        if (formState.bottle5LQty > 0) AquaPrimary else Color(0xFFE2E8F0)
                    )
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = if (isBn) "৫ লিটার বোতল (5L Bottle)" else "5 Litre Bottle",
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp,
                                color = NavyDark
                            )
                            Text(
                                text = if (isBn) "ছোট আয়োজন ও পারিবারিক টেবিল" else "For tables & small events",
                                fontSize = 11.sp,
                                color = SlateGray
                            )
                        }

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Surface(
                                shape = CircleShape,
                                color = PureWhite,
                                shadowElevation = 1.dp,
                                modifier = Modifier
                                    .size(32.dp)
                                    .clip(CircleShape)
                                    .clickable { onBottle5QtyChange(formState.bottle5LQty - 1) }
                                    .testTag("sheet_minus_5l")
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Icon(
                                        imageVector = Icons.Default.Remove,
                                        contentDescription = "Minus",
                                        tint = AquaDeep,
                                        modifier = Modifier.size(16.dp)
                                    )
                                }
                            }

                            Text(
                                text = "${formState.bottle5LQty}",
                                fontWeight = FontWeight.Bold,
                                fontSize = 15.sp,
                                color = NavyDark,
                                modifier = Modifier.padding(horizontal = 14.dp)
                            )

                            Surface(
                                shape = CircleShape,
                                color = AquaPrimary,
                                shadowElevation = 1.dp,
                                modifier = Modifier
                                    .size(32.dp)
                                    .clip(CircleShape)
                                    .clickable { onBottle5QtyChange(formState.bottle5LQty + 1) }
                                    .testTag("sheet_plus_5l")
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Icon(
                                        imageVector = Icons.Default.Add,
                                        contentDescription = "Plus",
                                        tint = PureWhite,
                                        modifier = Modifier.size(16.dp)
                                    )
                                }
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Service Type Selector
                Text(
                    text = if (isBn) "২. সার্ভিসের ধরন" else "2. Service Type",
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = NavyDark
                )

                Spacer(modifier = Modifier.height(8.dp))

                FlowRow(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    val serviceOptions = listOf(
                        Pair(DeliveryServiceType.HOME_DELIVERY, if (isBn) "বাসা (Home)" else "Home"),
                        Pair(DeliveryServiceType.OFFICE_DELIVERY, if (isBn) "অফিস (Office)" else "Office"),
                        Pair(DeliveryServiceType.EVENT_SUPPLY, if (isBn) "ইভেন্ট (Event)" else "Event"),
                        Pair(DeliveryServiceType.REGULAR_SUPPLY, if (isBn) "রেগুলার সাপ্লাই" else "Recurring")
                    )

                    serviceOptions.forEach { (type, label) ->
                        val isSelected = formState.serviceType == type
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = if (isSelected) AquaPrimary else Color(0xFFF1F5F9),
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .clickable { onServiceTypeChange(type) }
                        ) {
                            Text(
                                text = label,
                                fontSize = 12.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                color = if (isSelected) PureWhite else NavyHeading,
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Delivery Details Form
                Text(
                    text = if (isBn) "৩. ডেলিভারি তথ্য" else "3. Delivery & Contact Info",
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = NavyDark
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Phone Input (Primary)
                OutlinedTextField(
                    value = formState.phone,
                    onValueChange = onPhoneChange,
                    label = { Text(if (isBn) "মোবাইল নম্বর *" else "Mobile Number *") },
                    leadingIcon = {
                        Icon(
                            imageVector = Icons.Default.Phone,
                            contentDescription = null,
                            tint = AquaPrimary
                        )
                    },
                    placeholder = { Text("017XXXXXXXX") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("sheet_input_phone"),
                    shape = RoundedCornerShape(10.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = AquaPrimary,
                        unfocusedBorderColor = Color(0xFFCBD5E1)
                    ),
                    singleLine = true
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Customer Name Input
                OutlinedTextField(
                    value = formState.customerName,
                    onValueChange = onCustomerNameChange,
                    label = { Text(if (isBn) "আপনার নাম" else "Your Name") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("sheet_input_name"),
                    shape = RoundedCornerShape(10.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = AquaPrimary,
                        unfocusedBorderColor = Color(0xFFCBD5E1)
                    ),
                    singleLine = true
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Sylhet Area Exposed Dropdown
                ExposedDropdownMenuBox(
                    expanded = areaDropdownExpanded,
                    onExpandedChange = { areaDropdownExpanded = !areaDropdownExpanded },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    OutlinedTextField(
                        value = formState.area,
                        onValueChange = {},
                        readOnly = true,
                        label = { Text(if (isBn) "সিলেটের এলাকা" else "Sylhet Area") },
                        leadingIcon = {
                            Icon(
                                imageVector = Icons.Default.LocationOn,
                                contentDescription = null,
                                tint = AquaPrimary
                            )
                        },
                        trailingIcon = {
                            ExposedDropdownMenuDefaults.TrailingIcon(expanded = areaDropdownExpanded)
                        },
                        modifier = Modifier
                            .menuAnchor()
                            .fillMaxWidth(),
                        shape = RoundedCornerShape(10.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = AquaPrimary,
                            unfocusedBorderColor = Color(0xFFCBD5E1)
                        )
                    )

                    ExposedDropdownMenu(
                        expanded = areaDropdownExpanded,
                        onDismissRequest = { areaDropdownExpanded = false }
                    ) {
                        sylhetAreas.forEach { areaOption ->
                            DropdownMenuItem(
                                text = { Text(areaOption, fontSize = 13.sp) },
                                onClick = {
                                    onAreaChange(areaOption)
                                    areaDropdownExpanded = false
                                }
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Specific Address
                OutlinedTextField(
                    value = formState.address,
                    onValueChange = onAddressChange,
                    label = { Text(if (isBn) "পূর্ণাঙ্গ ঠিকানা (বাসা/রোড নম্বর)" else "Exact Address (House/Road/Floor)") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("sheet_input_address"),
                    shape = RoundedCornerShape(10.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = AquaPrimary,
                        unfocusedBorderColor = Color(0xFFCBD5E1)
                    ),
                    singleLine = true
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Notes / Instructions
                OutlinedTextField(
                    value = formState.notes,
                    onValueChange = onNotesChange,
                    label = { Text(if (isBn) "বিশেষ নির্দেশনা (ঐচ্ছিক)" else "Special Instructions (Optional)") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("sheet_input_notes"),
                    shape = RoundedCornerShape(10.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = AquaPrimary,
                        unfocusedBorderColor = Color(0xFFCBD5E1)
                    ),
                    maxLines = 2
                )

                Spacer(modifier = Modifier.height(18.dp))

                // Order Submit Button
                Button(
                    onClick = onSubmit,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp)
                        .testTag("sheet_confirm_order_button"),
                    colors = ButtonDefaults.buttonColors(containerColor = AquaPrimary),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Send,
                        contentDescription = "Submit",
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = if (isBn) "অর্ডার কনফার্ম করুন" else "Confirm & Submit Order",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                // Direct Call Option
                OutlinedButton(
                    onClick = onCallDirect,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(44.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = AquaDeep),
                    border = androidx.compose.foundation.BorderStroke(1.dp, AquaPale)
                ) {
                    Icon(
                        imageVector = Icons.Default.Call,
                        contentDescription = "Call",
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = if (isBn) "সরাসরি ফোনে কথা বলুন (+8801711102448)" else "Call Directly: +8801711102448",
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 12.sp
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))
            }
        }
    }
}
