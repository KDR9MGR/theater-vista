import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Upload, X, Save } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Category = Tables<'categories'>;

interface NewCategory {
  name: string;
  description: string;
  color_code: string;
  sort_order: number;
  is_active: boolean;
  image_file?: File;
}

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const [newCategory, setNewCategory] = useState<NewCategory>({
    name: '',
    description: '',
    color_code: '#FF0080',
    sort_order: 0,
    is_active: true,
  });

  const [editForm, setEditForm] = useState<NewCategory>({
    name: '',
    description: '',
    color_code: '#FF0080',
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch categories',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `categories/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('service-listing-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('service-listing-media')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      let imageUrl = null;
      
      if (newCategory.image_file) {
        imageUrl = await uploadImage(newCategory.image_file);
        if (!imageUrl) return;
      }

      const { error } = await supabase
        .from('categories')
        .insert({
          name: newCategory.name,
          description: newCategory.description,
          color_code: newCategory.color_code,
          sort_order: newCategory.sort_order,
          is_active: newCategory.is_active,
          image_url: imageUrl,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Category added successfully',
      });

      setNewCategory({
        name: '',
        description: '',
        color_code: '#FF0080',
        sort_order: 0,
        is_active: true,
      });
      setShowAddForm(false);
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: 'Error',
        description: 'Failed to add category',
        variant: 'destructive',
      });
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory) return;

    try {
      let imageUrl = editingCategory.image_url;
      
      if (editForm.image_file) {
        const newImageUrl = await uploadImage(editForm.image_file);
        if (newImageUrl) {
          imageUrl = newImageUrl;
        }
      }

      const { error } = await supabase
        .from('categories')
        .update({
          name: editForm.name,
          description: editForm.description,
          color_code: editForm.color_code,
          sort_order: editForm.sort_order,
          is_active: editForm.is_active,
          image_url: imageUrl,
        })
        .eq('id', editingCategory.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Category updated successfully',
      });

      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: 'Error',
        description: 'Failed to update category',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });

      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive',
      });
    }
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setEditForm({
      name: category.name,
      description: category.description || '',
      color_code: category.color_code || '#FF0080',
      sort_order: category.sort_order || 0,
      is_active: category.is_active || true,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isEdit) {
        setEditForm(prev => ({ ...prev, image_file: file }));
      } else {
        setNewCategory(prev => ({ ...prev, image_file: file }));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Categories Management</h1>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Add Category Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Add New Category</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <Label htmlFor="color">Color Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={newCategory.color_code}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, color_code: e.target.value }))}
                    className="w-16 h-10"
                  />
                  <Input
                    value={newCategory.color_code}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, color_code: e.target.value }))}
                    placeholder="#FF0080"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newCategory.description}
                onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter category description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={newCategory.sort_order}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={newCategory.is_active}
                  onCheckedChange={(checked) => setNewCategory(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="image">Category Image</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e)}
                  className="flex-1"
                />
                <Upload className="h-4 w-4 text-gray-500" />
              </div>
              {newCategory.image_file && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected: {newCategory.image_file.name}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddCategory} disabled={uploading || !newCategory.name}>
                {uploading ? 'Uploading...' : 'Add Category'}
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="relative">
            {editingCategory?.id === category.id ? (
              // Edit Form
              <CardContent className="p-4 space-y-4">
                <div>
                  <Label>Category Name</Label>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Color Code</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={editForm.color_code}
                      onChange={(e) => setEditForm(prev => ({ ...prev, color_code: e.target.value }))}
                      className="w-16 h-8"
                    />
                    <Input
                      value={editForm.color_code}
                      onChange={(e) => setEditForm(prev => ({ ...prev, color_code: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Sort Order</Label>
                  <Input
                    type="number"
                    value={editForm.sort_order}
                    onChange={(e) => setEditForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editForm.is_active}
                    onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label>Active</Label>
                </div>

                <div>
                  <Label>Update Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, true)}
                  />
                  {editForm.image_file && (
                    <p className="text-sm text-gray-600 mt-1">
                      New file: {editForm.image_file.name}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleEditCategory} size="sm" disabled={uploading}>
                    <Save className="h-4 w-4 mr-1" />
                    {uploading ? 'Saving...' : 'Save'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditingCategory(null)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            ) : (
              // Display Mode
              <>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color_code || '#FF0080' }}
                      />
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => startEdit(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {category.image_url && (
                    <div className="mb-3">
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                  
                  {category.description && (
                    <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                  )}
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Order: {category.sort_order}</span>
                    <Badge variant={category.is_active ? 'default' : 'secondary'}>
                      {category.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No categories found. Add your first category to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminCategories;