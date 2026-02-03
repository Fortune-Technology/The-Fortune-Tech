'use client';

import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSave, FaTimes, FaChevronDown, FaChevronRight, FaSpinner, FaLayerGroup, FaStar } from 'react-icons/fa';
import DeleteConfirmModal from '../../../components/ui/DeleteConfirmModal';
import { useDeleteConfirm } from '../../../lib/hooks/useDeleteConfirm';
import {
    useGetTechnologiesQuery,
    useCreateTechnologyCategoryMutation,
    useUpdateTechnologyCategoryMutation,
    useDeleteTechnologyCategoryMutation,
    useAddTechnologyItemMutation,
    useUpdateTechnologyItemMutation,
    useDeleteTechnologyItemMutation,
} from '../../../lib/store/api/technologiesApi';
import { useAppDispatch } from '../../../lib/store/hooks';
import { showSuccessNotification, showErrorNotification } from '../../../lib/store/slices/notificationSlice';

interface CategoryFormData {
    name: string;
    description: string;
    icon: string;
    featured: boolean;
    isActive: boolean;
}

interface ItemFormData {
    name: string;
    icon: string;
    description: string;
    proficiency: number;
}

const initialCategoryFormData: CategoryFormData = {
    name: '',
    description: '',
    icon: '',
    featured: false,
    isActive: true,
};

const initialItemFormData: ItemFormData = {
    name: '',
    icon: '',
    description: '',
    proficiency: 80,
};

export default function TechnologiesPage() {
    const dispatch = useAppDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [categoryFormData, setCategoryFormData] = useState<CategoryFormData>(initialCategoryFormData);
    const [itemFormData, setItemFormData] = useState<ItemFormData>(initialItemFormData);
    const [categoryIconFile, setCategoryIconFile] = useState<File | null>(null);
    const [itemIconFile, setItemIconFile] = useState<File | null>(null);
    const deleteConfirm = useDeleteConfirm();

    // RTK Query hooks
    const { data: technologiesResponse, isLoading, isError } = useGetTechnologiesQuery();
    const [createCategory, { isLoading: isCreatingCategory }] = useCreateTechnologyCategoryMutation();
    const [updateCategory, { isLoading: isUpdatingCategory }] = useUpdateTechnologyCategoryMutation();
    const [deleteCategory, { isLoading: isDeletingCategory }] = useDeleteTechnologyCategoryMutation();
    const [addItem, { isLoading: isAddingItem }] = useAddTechnologyItemMutation();
    const [updateItem, { isLoading: isUpdatingItem }] = useUpdateTechnologyItemMutation();
    const [deleteItem, { isLoading: isDeletingItem }] = useDeleteTechnologyItemMutation();

    const categories = technologiesResponse?.data || [];

    const filteredCategories = categories.filter(cat =>
        (cat.name || (cat as any).category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.items?.some(item => (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev => {
            const next = new Set(prev);
            if (next.has(categoryId)) {
                next.delete(categoryId);
            } else {
                next.add(categoryId);
            }
            return next;
        });
    };

    // Category handlers
    const handleOpenCategoryModal = (category: any = null) => {
        if (category) {
            setEditingCategoryId(category._id);
            setCategoryFormData({
                name: category.name || '',
                description: category.description || '',
                icon: category.icon || '',
                featured: category.featured || false,
                isActive: category.isActive ?? true,
            });
        } else {
            setEditingCategoryId(null);
            setCategoryFormData(initialCategoryFormData);
        }
        setCategoryIconFile(null);
        setIsCategoryModalOpen(true);
    };

    const handleCloseCategoryModal = () => {
        setIsCategoryModalOpen(false);
        setEditingCategoryId(null);
        setCategoryFormData(initialCategoryFormData);
        setCategoryIconFile(null);
    };

    const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setCategoryFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleCategoryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCategoryIconFile(e.target.files[0]);
        }
    };

    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', categoryFormData.name);
        formData.append('description', categoryFormData.description);
        // formData.append('icon', categoryFormData.icon); // Handled via file
        if (categoryIconFile) {
            formData.append('icon', categoryIconFile);
        }
        formData.append('featured', String(categoryFormData.featured));
        formData.append('isActive', String(categoryFormData.isActive));

        try {
            if (editingCategoryId) {
                await updateCategory({ id: editingCategoryId, data: formData }).unwrap();
                dispatch(showSuccessNotification('Category updated successfully'));
            } else {
                await createCategory(formData).unwrap();
                dispatch(showSuccessNotification('Category created successfully'));
            }
            handleCloseCategoryModal();
        } catch (err: any) {
            dispatch(showErrorNotification(err?.data?.message || 'Failed to save category'));
        }
    };

    const handleDeleteCategory = (id: string, name: string) => {
        deleteConfirm.showDeleteConfirm({
            title: 'Delete Technology Category',
            message: 'This will delete the category and all its items. This cannot be undone.',
            itemName: name,
            onConfirm: async () => {
                try {
                    await deleteCategory(id).unwrap();
                    dispatch(showSuccessNotification('Category deleted successfully'));
                } catch (err: any) {
                    dispatch(showErrorNotification(err?.data?.message || 'Failed to delete category'));
                }
            }
        });
    };

    // Item handlers
    const handleOpenItemModal = (categoryId: string, item: any = null) => {
        setSelectedCategoryId(categoryId);
        if (item) {
            setEditingItemId(item._id);
            setItemFormData({
                name: item.name || '',
                icon: item.icon || '',
                description: item.description || '',
                proficiency: item.proficiency || 80,
            });
        } else {
            setEditingItemId(null);
            setItemFormData(initialItemFormData);
        }
        setItemIconFile(null);
        setIsItemModalOpen(true);
    };

    const handleCloseItemModal = () => {
        setIsItemModalOpen(false);
        setEditingItemId(null);
        setSelectedCategoryId(null);
        setItemFormData(initialItemFormData);
        setItemIconFile(null);
    };

    const handleItemInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setItemFormData(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    };

    const handleItemFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setItemIconFile(e.target.files[0]);
        }
    };

    const handleSaveItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCategoryId) return;

        const formData = new FormData();
        formData.append('name', itemFormData.name);
        formData.append('description', itemFormData.description);
        // formData.append('icon', itemFormData.icon); // Handled via file
        if (itemIconFile) {
            formData.append('icon', itemIconFile);
        }
        formData.append('proficiency', String(itemFormData.proficiency));

        try {
            if (editingItemId) {
                await updateItem({ categoryId: selectedCategoryId, itemId: editingItemId, data: formData }).unwrap();
                dispatch(showSuccessNotification('Technology item updated successfully'));
            } else {
                await addItem({ categoryId: selectedCategoryId, data: formData }).unwrap();
                dispatch(showSuccessNotification('Technology item added successfully'));
            }
            handleCloseItemModal();
        } catch (err: any) {
            dispatch(showErrorNotification(err?.data?.message || 'Failed to save technology item'));
        }
    };

    const handleDeleteItem = (categoryId: string, itemId: string, itemName: string) => {
        deleteConfirm.showDeleteConfirm({
            title: 'Delete Technology Item',
            message: 'This action will permanently delete this technology. This cannot be undone.',
            itemName: itemName,
            onConfirm: async () => {
                try {
                    await deleteItem({ categoryId, itemId }).unwrap();
                    dispatch(showSuccessNotification('Technology item deleted successfully'));
                } catch (err: any) {
                    dispatch(showErrorNotification(err?.data?.message || 'Failed to delete technology item'));
                }
            }
        });
    };

    if (isLoading) {
        return (
            <AdminLayout pageTitle="Technologies">
                <div className="admin-loading">
                    <FaSpinner className="spinner" />
                    <p>Loading technologies...</p>
                </div>
            </AdminLayout>
        );
    }

    if (isError) {
        return (
            <AdminLayout pageTitle="Technologies">
                <div className="admin-error">
                    <p>Failed to load technologies. Please try again later.</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout pageTitle="Technologies">
            {/* Header Actions */}
            <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem 1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '400px' }}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search technologies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ paddingLeft: '2.5rem' }}
                        />
                        <FaSearch style={{
                            position: 'absolute',
                            left: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--text-muted)'
                        }} />
                    </div>

                    <button className="btn btn-primary" onClick={() => handleOpenCategoryModal()} style={{ marginLeft: 'auto' }}>
                        <FaPlus /> Add Category
                    </button>
                </div>
            </div>

            {/* Categories Sections */}
            {filteredCategories.length === 0 ? (
                <div className="admin-card">
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        No technology categories found
                    </div>
                </div>
            ) : (
                filteredCategories.map((category, index) => (
                    <div key={category._id || `cat-${index}`} className="admin-card category-card">
                        {/* Category Header */}
                        <div className="category-section-header">
                            <div className="category-section-info">
                                <h3 className="category-section-title">{category.name || (category as any).category}</h3>
                                <p className="category-section-description">{category.description || `Modern ${(category.name || (category as any).category || '').toLowerCase()} technologies`}</p>
                            </div>
                            <div className="category-section-actions">
                                <button className="btn btn-outline btn-sm" onClick={() => handleOpenItemModal(category._id)}>
                                    <FaPlus /> Add Tech
                                </button>
                                <button className="icon-btn" onClick={() => handleOpenCategoryModal(category)} title="Edit Category">
                                    <FaEdit />
                                </button>
                                <button
                                    className="icon-btn delete"
                                    onClick={() => handleDeleteCategory(category._id, category.name || (category as any).category)}
                                    title="Delete Category"
                                    disabled={isDeletingCategory}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>

                        {/* Tech Items Grid */}
                        <div className="tech-items-grid">
                            {category.items && category.items.length > 0 ? (
                                category.items.map((item, idx) => (
                                    <div key={item._id || `item-${idx}`} className="tech-item-card">
                                        <div className="tech-item-main">
                                            <div className={`tech-item-icon ${!item.icon ? 'fallback' : ''}`}>
                                                {item.icon ? (
                                                    <img
                                                        src={item.icon.startsWith('http') || item.icon.startsWith('/') ? `${item.icon.startsWith('http') ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000')}${item.icon.startsWith('/') ? '' : '/'}${item.icon}` : item.icon}
                                                        alt={item.name}
                                                        className="tech-icon-img"
                                                        onError={(e) => {
                                                            const img = e.target as HTMLImageElement;
                                                            img.style.display = 'none';
                                                            img.nextElementSibling?.classList.remove('hidden');
                                                        }}
                                                    />
                                                ) : null}
                                                <span className={`fallback-letter ${item.icon ? 'hidden' : ''}`}>
                                                    {item.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="tech-item-details">
                                                <span className="tech-item-name">
                                                    {item.name}
                                                    {(item.proficiency ?? 0) >= 90 && <FaStar className="featured-star" />}
                                                </span>
                                                <span className="tech-item-level">
                                                    {(item.proficiency ?? 0) >= 90 ? 'Expert' : (item.proficiency ?? 0) >= 70 ? 'Advanced' : 'Intermediate'}
                                                    {item.description && ` • ${item.description}`}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="tech-item-actions">
                                            <button className="icon-btn" onClick={() => handleOpenItemModal(category._id, item)} title="Edit">
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="icon-btn delete"
                                                onClick={() => handleDeleteItem(category._id, item._id, item.name)}
                                                title="Delete"
                                                disabled={isDeletingItem}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-items">
                                    No items in this category.{' '}
                                    <button className="link-btn" onClick={() => handleOpenItemModal(category._id)}>Add one</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}

            {/* Category Modal */}
            {isCategoryModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content" data-lenis-prevent>
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">{editingCategoryId ? 'Edit Category' : 'Add Category'}</h3>
                            <button className="table-action-btn" onClick={handleCloseCategoryModal}><FaTimes /></button>
                        </div>
                        <form onSubmit={handleSaveCategory} style={{ padding: '1.5rem' }}>
                            <div className="form-group">
                                <label className="form-label">Category Name</label>
                                <input name="name" className="form-input" value={categoryFormData.name} onChange={handleCategoryInputChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea name="description" className="form-input" value={categoryFormData.description} onChange={handleCategoryInputChange} rows={3} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Icon (Upload File)</label>
                                <input type="file" accept="image/*" className="form-input" onChange={handleCategoryFileChange} />
                                {categoryFormData.icon && !categoryIconFile && (
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        Current: {categoryFormData.icon}
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input type="checkbox" name="isActive" checked={categoryFormData.isActive} onChange={handleCategoryInputChange} />
                                    Active
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input type="checkbox" name="featured" checked={categoryFormData.featured} onChange={handleCategoryInputChange} />
                                    Featured
                                </label>
                            </div>
                            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" className="btn btn-outline" onClick={handleCloseCategoryModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isCreatingCategory || isUpdatingCategory}>
                                    {(isCreatingCategory || isUpdatingCategory) ? <FaSpinner className="spinner" /> : <FaSave />}
                                    {' '}Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Item Modal */}
            {isItemModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content" data-lenis-prevent>
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">{editingItemId ? 'Edit Technology' : 'Add Technology'}</h3>
                            <button className="table-action-btn" onClick={handleCloseItemModal}><FaTimes /></button>
                        </div>
                        <form onSubmit={handleSaveItem} style={{ padding: '1.5rem' }}>
                            <div className="form-group">
                                <label className="form-label">Technology Name</label>
                                <input name="name" className="form-input" value={itemFormData.name} onChange={handleItemInputChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Icon (Upload File)</label>
                                <input type="file" accept="image/*" className="form-input" onChange={handleItemFileChange} />
                                {itemFormData.icon && !itemIconFile && (
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        Current: {itemFormData.icon}
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea name="description" className="form-input" value={itemFormData.description} onChange={handleItemInputChange} rows={2} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Proficiency: {itemFormData.proficiency}%</label>
                                <input type="range" name="proficiency" min="0" max="100" value={itemFormData.proficiency} onChange={handleItemInputChange} style={{ width: '100%' }} />
                            </div>
                            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" className="btn btn-outline" onClick={handleCloseItemModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isAddingItem || isUpdatingItem}>
                                    {(isAddingItem || isUpdatingItem) ? <FaSpinner className="spinner" /> : <FaSave />}
                                    {' '}Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <DeleteConfirmModal {...deleteConfirm.modalProps} />
        </AdminLayout>
    );
}
