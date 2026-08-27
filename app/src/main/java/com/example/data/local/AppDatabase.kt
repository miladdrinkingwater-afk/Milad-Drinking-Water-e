package com.example.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverter
import androidx.room.TypeConverters
import com.example.data.model.DeliveryFrequency
import com.example.data.model.DeliveryServiceType
import com.example.data.model.OrderStatus
import com.example.data.model.WaterOrder
import com.example.data.model.WaterProductType

class Converters {
    @TypeConverter
    fun fromProductType(value: WaterProductType): String = value.name

    @TypeConverter
    fun toProductType(value: String): WaterProductType = try {
        WaterProductType.valueOf(value)
    } catch (e: Exception) {
        WaterProductType.JAR_20L
    }

    @TypeConverter
    fun fromServiceType(value: DeliveryServiceType): String = value.name

    @TypeConverter
    fun toServiceType(value: String): DeliveryServiceType = try {
        DeliveryServiceType.valueOf(value)
    } catch (e: Exception) {
        DeliveryServiceType.HOME_DELIVERY
    }

    @TypeConverter
    fun fromFrequency(value: DeliveryFrequency): String = value.name

    @TypeConverter
    fun toFrequency(value: String): DeliveryFrequency = try {
        DeliveryFrequency.valueOf(value)
    } catch (e: Exception) {
        DeliveryFrequency.ONE_TIME
    }

    @TypeConverter
    fun fromStatus(value: OrderStatus): String = value.name

    @TypeConverter
    fun toStatus(value: String): OrderStatus = try {
        OrderStatus.valueOf(value)
    } catch (e: Exception) {
        OrderStatus.RECEIVED
    }
}

@Database(entities = [WaterOrder::class], version = 1, exportSchema = false)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {
    abstract fun orderDao(): OrderDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getInstance(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "milad_water_db"
                ).fallbackToDestructiveMigration().build()
                INSTANCE = instance
                instance
            }
        }
    }
}
