"use client";

import { useState, useEffect } from "react";
import { Search, AlertTriangle, Package, Plus, Minus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { WarehouseItem } from "@/types/type";

export default function WarehousePage() {
  const [items, setItems] = useState<WarehouseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<WarehouseItem | null>(null);
  const [stockAdjustment, setStockAdjustment] = useState(0);

  useEffect(() => {
    const fetchWarehouseItems = async () => {
      try {
        const response = await fetch("/api/admin/warehouse");
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch warehouse items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouseItems();
  }, []);

  const filteredItems = items.filter(
    (item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = filteredItems.filter(
    (item) => item.availableStock <= item.reorderLevel
  );

  const adjustStock = async (itemId: string, adjustment: number) => {
    try {
      await fetch(`/api/admin/warehouse/${itemId}/adjust`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adjustment }),
      });

      setItems(
        items.map((item) =>
          item.id === itemId
            ? {
                ...item,
                currentStock: item.currentStock + adjustment,
                availableStock: item.availableStock + adjustment,
                lastUpdated: new Date().toISOString(),
              }
            : item
        )
      );
      setSelectedItem(null);
      setStockAdjustment(0);
    } catch (error) {
      console.error("Failed to adjust stock:", error);
    }
  };

  const getStockStatus = (item: WarehouseItem) => {
    if (item.availableStock === 0)
      return { text: "Out of Stock", variant: "destructive" as const };
    if (item.availableStock <= item.reorderLevel)
      return { text: "Low Stock", variant: "secondary" as const };
    return { text: "In Stock", variant: "default" as const };
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Warehouse</h1>
        <p className="text-muted-foreground">
          Manage inventory and stock levels
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredItems.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {lowStockItems.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Stock Value
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredItems.reduce((sum, item) => sum + item.currentStock, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by product name, SKU, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {lowStockItems.length} items are running low on stock and need
              attention.
            </p>
            <div className="space-y-2">
              {lowStockItems.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-2 bg-muted rounded"
                >
                  <span className="font-medium">
                    {item.productName} - {item.color} {item.size}
                  </span>
                  <Badge variant="destructive">
                    {item.availableStock} left
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items ({filteredItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Reserved</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Reorder Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const status = getStockStatus(item);
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.color} - {item.size}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {item.sku}
                      </TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell className="font-medium">
                        {item.currentStock}
                      </TableCell>
                      <TableCell>{item.reservedStock}</TableCell>
                      <TableCell className="font-medium">
                        {item.availableStock}
                      </TableCell>
                      <TableCell>{item.reorderLevel}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.text}</Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedItem(item)}
                            >
                              Adjust Stock
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Adjust Stock - {selectedItem?.productName}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>
                                  Current Stock: {selectedItem?.currentStock}
                                </Label>
                              </div>
                              <div className="flex items-center gap-4">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() =>
                                    setStockAdjustment(stockAdjustment - 1)
                                  }
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                  type="number"
                                  value={stockAdjustment}
                                  onChange={(e) =>
                                    setStockAdjustment(Number(e.target.value))
                                  }
                                  className="w-24 text-center"
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() =>
                                    setStockAdjustment(stockAdjustment + 1)
                                  }
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() =>
                                    selectedItem &&
                                    adjustStock(
                                      selectedItem.id,
                                      stockAdjustment
                                    )
                                  }
                                  disabled={stockAdjustment === 0}
                                >
                                  Apply Adjustment
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedItem(null);
                                    setStockAdjustment(0);
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
