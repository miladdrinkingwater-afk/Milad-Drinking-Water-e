package com.example.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.data.model.WaterOrder
import kotlinx.coroutines.flow.Flow

@Dao
interface OrderDao {
    @Query("SELECT * FROM water_orders ORDER BY id DESC")
    fun getAllOrders(): Flow<List<WaterOrder>>

    @Query("SELECT * FROM water_orders WHERE id = :orderId")
    suspend fun getOrderById(orderId: Long): WaterOrder?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrder(order: WaterOrder): Long

    @Update
    suspend fun updateOrder(order: WaterOrder)

    @Query("DELETE FROM water_orders WHERE id = :orderId")
    suspend fun deleteOrder(orderId: Long)
}
