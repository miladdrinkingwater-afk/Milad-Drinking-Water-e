package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.LocalShipping
import androidx.compose.material.icons.filled.Repeat
import androidx.compose.material.icons.filled.WaterDrop
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
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
import com.example.data.model.OrderStatus
import com.example.data.model.WaterOrder
import com.example.ui.theme.AquaDeep
import com.example.ui.theme.AquaIce
import com.example.ui.theme.AquaPrimary
import com.example.ui.theme.BstiGreen
import com.example.ui.theme.NavyDark
import com.example.ui.theme.NavyHeading
import com.example.ui.theme.PureWhite
import com.example.ui.theme.SlateGray
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OrderHistorySheet(
    isOpen: Boolean,
    language: AppLanguage,
    orders: List<WaterOrder>,
    onReorder: (WaterOrder) -> Unit,
    onDeleteOrder: (Long) -> Unit,
    onCallSupport: () -> Unit,
    onDismiss: () -> Unit
) {
    val isBn = language == AppLanguage.BN
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val dateFormat = SimpleDateFormat("dd MMM, hh:mm a", Locale.getDefault())

    if (isOpen) {
        ModalBottomSheet(
            onDismissRequest = onDismiss,
            sheetState = sheetState,
            containerColor = PureWhite,
            dragHandle = null
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 16.dp)
                    .navigationBarsPadding()
                    .testTag("order_history_sheet")
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(AquaIce),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.History,
                                contentDescription = null,
                                tint = AquaPrimary,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                text = if (isBn) "আমার অর্ডারসমূহ" else "My Water Orders",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Bold,
                                color = NavyDark
                            )
                            Text(
                                text = if (isBn) "মোট ${orders.size}টি অর্ডার সংরক্ষিত" else "${orders.size} total orders recorded",
                                fontSize = 11.sp,
                                color = SlateGray
                            )
                        }
                    }

                    IconButton(onClick = onDismiss) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Close",
                            tint = SlateGray
                        )
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                if (orders.isEmpty()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(200.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(
                                imageVector = Icons.Default.WaterDrop,
                                contentDescription = null,
                                tint = AquaIce,
                                modifier = Modifier.size(56.dp)
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = if (isBn) "এখনও কোনো অর্ডার রেকর্ড নেই" else "No order history yet",
                                fontSize = 14.sp,
                                color = SlateGray,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(360.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        items(orders, key = { it.id }) { order ->
                            Card(
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(12.dp),
                                colors = CardDefaults.cardColors(containerColor = Color(0xFFF8FAFC)),
                                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE2E8F0))
                            ) {
                                Column(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(12.dp)
                                ) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(
                                            text = "Order #${order.id}",
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 13.sp,
                                            color = NavyDark
                                        )

                                        Surface(
                                            shape = RoundedCornerShape(6.dp),
                                            color = when (order.status) {
                                                OrderStatus.RECEIVED -> Color(0xFFEFF6FF)
                                                OrderStatus.CONFIRMED -> Color(0xFFECFDF5)
                                                OrderStatus.DISPATCHED -> Color(0xFFFFFBEB)
                                                OrderStatus.DELIVERED -> Color(0xFFF0FDF4)
                                            }
                                        ) {
                                            Text(
                                                text = when (order.status) {
                                                    OrderStatus.RECEIVED -> if (isBn) "গৃহীত (Received)" else "Received"
                                                    OrderStatus.CONFIRMED -> if (isBn) "কনফার্মড" else "Confirmed"
                                                    OrderStatus.DISPATCHED -> if (isBn) "ডেলিভারিতে আছে" else "Dispatched"
                                                    OrderStatus.DELIVERED -> if (isBn) "সম্পন্ন" else "Delivered"
                                                },
                                                fontSize = 10.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = when (order.status) {
                                                    OrderStatus.RECEIVED -> AquaDeep
                                                    OrderStatus.CONFIRMED -> BstiGreen
                                                    OrderStatus.DISPATCHED -> Color(0xFFD97706)
                                                    OrderStatus.DELIVERED -> Color(0xFF047857)
                                                },
                                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                            )
                                        }
                                    }

                                    Spacer(modifier = Modifier.height(6.dp))

                                    // Items quantity display
                                    Row(
                                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        if (order.jar20LQuantity > 0) {
                                            Text(
                                                text = "20L Jar: ${order.jar20LQuantity} pcs",
                                                fontWeight = FontWeight.SemiBold,
                                                fontSize = 12.sp,
                                                color = AquaDeep
                                            )
                                        }
                                        if (order.bottle5LQuantity > 0) {
                                            Text(
                                                text = "5L Bottle: ${order.bottle5LQuantity} pcs",
                                                fontWeight = FontWeight.SemiBold,
                                                fontSize = 12.sp,
                                                color = AquaPrimary
                                            )
                                        }
                                    }

                                    Spacer(modifier = Modifier.height(4.dp))

                                    Text(
                                        text = "${order.area} • ${order.address}",
                                        fontSize = 11.sp,
                                        color = SlateGray
                                    )

                                    Text(
                                        text = dateFormat.format(Date(order.timestamp)),
                                        fontSize = 10.sp,
                                        color = Color(0xFF94A3B8)
                                    )

                                    Spacer(modifier = Modifier.height(8.dp))

                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.End,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        IconButton(
                                            onClick = { onDeleteOrder(order.id) },
                                            modifier = Modifier.size(28.dp)
                                        ) {
                                            Icon(
                                                imageVector = Icons.Default.Delete,
                                                contentDescription = "Delete",
                                                tint = Color(0xFFEF4444),
                                                modifier = Modifier.size(16.dp)
                                            )
                                        }

                                        Spacer(modifier = Modifier.width(8.dp))

                                        Button(
                                            onClick = { onReorder(order) },
                                            colors = ButtonDefaults.buttonColors(
                                                containerColor = AquaIce,
                                                contentColor = AquaDeep
                                            ),
                                            contentPadding = androidx.compose.foundation.layout.PaddingValues(
                                                horizontal = 10.dp,
                                                vertical = 4.dp
                                            ),
                                            shape = RoundedCornerShape(6.dp),
                                            modifier = Modifier.height(28.dp)
                                        ) {
                                            Icon(
                                                imageVector = Icons.Default.Repeat,
                                                contentDescription = "Reorder",
                                                modifier = Modifier.size(12.dp)
                                            )
                                            Spacer(modifier = Modifier.width(4.dp))
                                            Text(
                                                text = if (isBn) "আবার অর্ডার করুন" else "Re-order",
                                                fontSize = 11.sp,
                                                fontWeight = FontWeight.Bold
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
