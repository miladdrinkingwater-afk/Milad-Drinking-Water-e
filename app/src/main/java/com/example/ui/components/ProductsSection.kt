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
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material.icons.filled.ShoppingBag
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
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
import com.example.data.model.AppLanguage
import com.example.data.model.ProductInfo
import com.example.data.model.WaterProductType
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
fun ProductsSection(
    language: AppLanguage,
    products: List<ProductInfo>,
    onOrderProduct: (WaterProductType, Int) -> Unit,
    onCallClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val isBn = language == AppLanguage.BN

    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(PureWhite)
            .padding(horizontal = 16.dp, vertical = 24.dp)
            .testTag("products_section")
    ) {
        // Section Header
        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(8.dp))
                .background(AquaIce)
                .padding(horizontal = 10.dp, vertical = 4.dp)
        ) {
            Text(
                text = if (isBn) "আমাদের প্রোডাক্টসমূহ" else "Our Products",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = AquaDeep
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = if (isBn) "আমাদের পানি" else "Our Pure Water",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            color = NavyDark
        )

        Text(
            text = if (isBn) "আপনার প্রয়োজন অনুযায়ী বিশুদ্ধ পানি (২০ লিটার ও ৫ লিটার)" else "Pure drinking water crafted for your daily needs (20 Litre & 5 Litre)",
            style = MaterialTheme.typography.bodyMedium,
            color = SlateGray
        )

        Spacer(modifier = Modifier.height(18.dp))

        // Product Cards
        products.forEachIndexed { index, product ->
            val productType = if (index == 0) WaterProductType.JAR_20L else WaterProductType.BOTTLE_5L
            var localQty by remember { mutableIntStateOf(if (index == 0) 2 else 2) }

            ProductCardItem(
                product = product,
                productType = productType,
                isBn = isBn,
                quantity = localQty,
                onQtyChange = { localQty = it.coerceAtLeast(1) },
                onOrderClick = { onOrderProduct(productType, localQty) },
                onCallClick = onCallClick
            )

            if (index < products.size - 1) {
                Spacer(modifier = Modifier.height(20.dp))
            }
        }
    }
}

@Composable
fun ProductCardItem(
    product: ProductInfo,
    productType: WaterProductType,
    isBn: Boolean,
    quantity: Int,
    onQtyChange: (Int) -> Unit,
    onOrderClick: () -> Unit,
    onCallClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .testTag("product_card_${product.id.lowercase()}"),
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = PureWhite),
        elevation = CardDefaults.cardElevation(defaultElevation = 3.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE5EFF5))
    ) {
        Column(modifier = Modifier.fillMaxWidth()) {
            // Product Image Container with Size Badge
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(180.dp)
                    .background(
                        Brush.verticalGradient(
                            listOf(Color(0xFFE9F4F9), Color(0xFFD6ECF7))
                        )
                    )
            ) {
                Image(
                    painter = painterResource(id = product.drawableRes),
                    contentDescription = product.nameEn,
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(8.dp),
                    contentScale = ContentScale.Fit
                )

                // Top Left Size Pill
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = AquaPrimary,
                    modifier = Modifier
                        .align(Alignment.TopStart)
                        .padding(12.dp)
                ) {
                    Text(
                        text = if (isBn) product.sizeBn else product.sizeEn,
                        color = PureWhite,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                    )
                }

                // Top Right BSTI Approved Tag
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = PureWhite.copy(alpha = 0.95f),
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(12.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Verified,
                            contentDescription = "BSTI",
                            tint = BstiGreen,
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "BSTI Approved",
                            color = AquaDeep,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            // Content Section
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                Text(
                    text = if (isBn) product.nameBn else product.nameEn,
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = NavyDark
                )

                Spacer(modifier = Modifier.height(4.dp))

                Text(
                    text = if (isBn) product.descBn else product.descEn,
                    style = MaterialTheme.typography.bodyMedium,
                    color = SlateGray,
                    lineHeight = 18.sp
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Highlights Bullet Points
                val highlights = if (isBn) product.highlightsBn else product.highlightsEn
                Column(
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    highlights.forEach { highlight ->
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(16.dp)
                                    .clip(CircleShape)
                                    .background(AquaIce),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Check,
                                    contentDescription = null,
                                    tint = AquaPrimary,
                                    modifier = Modifier.size(10.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = highlight,
                                fontSize = 12.sp,
                                color = NavyHeading,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Quantity Selector Row
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(AquaIce)
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = if (isBn) "পরিমাণ নির্বাচন করুন:" else "Select Quantity:",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = NavyDark
                    )

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Surface(
                            shape = CircleShape,
                            color = PureWhite,
                            shadowElevation = 1.dp,
                            modifier = Modifier
                                .size(32.dp)
                                .clip(CircleShape)
                                .clickable { onQtyChange(quantity - 1) }
                                .testTag("qty_minus_${product.id}")
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(
                                    imageVector = Icons.Default.Remove,
                                    contentDescription = "Decrease",
                                    tint = AquaDeep,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }

                        Text(
                            text = "$quantity",
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
                                .clickable { onQtyChange(quantity + 1) }
                                .testTag("qty_plus_${product.id}")
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(
                                    imageVector = Icons.Default.Add,
                                    contentDescription = "Increase",
                                    tint = PureWhite,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Action Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = onOrderClick,
                        modifier = Modifier
                            .weight(1.2f)
                            .height(44.dp)
                            .testTag("order_button_${product.id}"),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = AquaPrimary,
                            contentColor = PureWhite
                        ),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.ShoppingBag,
                            contentDescription = "Order",
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = if (isBn) "অর্ডার করুন" else "Order ($quantity)",
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp
                        )
                    }

                    OutlinedButton(
                        onClick = onCallClick,
                        modifier = Modifier
                            .weight(0.9f)
                            .height(44.dp)
                            .testTag("call_button_${product.id}"),
                        colors = ButtonDefaults.outlinedButtonColors(
                            contentColor = AquaDeep
                        ),
                        shape = RoundedCornerShape(10.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, AquaPrimary)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Call,
                            contentDescription = "Call",
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = if (isBn) "কল করুন" else "Call",
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 12.sp
                        )
                    }
                }
            }
        }
    }
}
