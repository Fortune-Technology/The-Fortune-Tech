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
import ImageUpload from '../../../components/ui/ImageUpload';

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

    useCases: string;
    featured: boolean;
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
    useCases: '',
    featured: false,
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
    const [existingCategoryIconUrl, setExistingCategoryIconUrl] = useState<string | null>(null);
    const [existingItemIconUrl, setExistingItemIconUrl] = useState<string | null>(null);
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
        (cat.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
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
            setEditingCategoryId(category.id || category._id);
            setCategoryFormData({
                name: category.category || '',
                description: category.description || '',
                icon: category.icon || '',
                featured: category.featured || false,
                isActive: category.isActive ?? true,
            });
            setExistingCategoryIconUrl(category.icon || null);
        } else {
            setEditingCategoryId(null);
            setCategoryFormData(initialCategoryFormData);
            setExistingCategoryIconUrl(null);
        }
        setCategoryIconFile(null);
        setIsCategoryModalOpen(true);
    };

    const handleCloseCategoryModal = () => {
        setIsCategoryModalOpen(false);
        setEditingCategoryId(null);
        setCategoryFormData(initialCategoryFormData);
        setCategoryIconFile(null);
        setExistingCategoryIconUrl(null);
    };

    const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setCategoryFormData(prev => ({ ...prev, [name]: val }));
    };

    // Category file handler replaced by ImageUpload component handler directly in JSX

    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('category', categoryFormData.name);
        formData.append('description', categoryFormData.description);
        // Folder path
        formData.append('folder', 'technology');

        // formData.append('icon', categoryFormData.icon); // Handled via file
        if (categoryIconFile) {
            formData.append('icon', categoryIconFile);
        }

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
                useCases: item.useCases?.join(', ') || '',
                featured: item.featured || false,
            });
            setExistingItemIconUrl(item.icon || null);
        } else {
            setEditingItemId(null);
            setItemFormData(initialItemFormData);
            setExistingItemIconUrl(null);
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
        setExistingItemIconUrl(null);
    };

    const handleItemInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : (type === 'number' ? Number(value) : value);
        setItemFormData(prev => ({ ...prev, [name]: val }));
    };

    // Item file handler replaced by ImageUpload component handler directly in JSX

    const handleSaveItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCategoryId) return;

        const formData = new FormData();
        formData.append('name', itemFormData.name);


        // Split useCases into array
        if (itemFormData.useCases) {
            itemFormData.useCases.split(',').forEach(uc => {
                const trimmed = uc.trim();
                if (trimmed) formData.append('useCases[]', trimmed);
            });
        }

        formData.append('featured', String(itemFormData.featured));
        // Folder path for tech items
        formData.append('folder', `technology`);

        if (itemIconFile) {
            formData.append('icon', itemIconFile);
        }

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
                    <div key={(category as any).id || category._id || `cat-${index}`} className="admin-card category-card">
                        {/* Category Header */}
                        <div className="category-section-header">
                            <div className="category-section-info">
                                <h3 className="category-section-title">{category.category}</h3>
                                <p className="category-section-description">{category.description || `Modern ${(category.category || '').toLowerCase()} technologies`}</p>
                            </div>
                            <div className="category-section-actions">
                                <button className="btn btn-outline btn-sm" onClick={() => handleOpenItemModal((category as any).id || category._id)}>
                                    <FaPlus /> Add Tech
                                </button>
                                <button className="icon-btn" onClick={() => handleOpenCategoryModal(category)} title="Edit Category">
                                    <FaEdit />
                                </button>
                                <button
                                    className="icon-btn delete"
                                    onClick={() => handleDeleteCategory((category as any).id || category._id, category.category)}
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

                                            </div>
                                            <div className="tech-item-details">
                                                <span className="tech-item-name">
                                                    {item.name}
                                                    {item.featured && <FaStar className="featured-star" />}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="tech-item-actions">
                                            <button className="icon-btn" onClick={() => handleOpenItemModal((category as any).id || category._id, item)} title="Edit">
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="icon-btn delete"
                                                onClick={() => handleDeleteItem((category as any).id || category._id, item._id, item.name)}
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
                                    <button className="link-btn" onClick={() => handleOpenItemModal((category as any).id || category._id)}>Add one</button>
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
                                <ImageUpload
                                    label="Icon"
                                    value={categoryIconFile || existingCategoryIconUrl}
                                    onChange={(file) => setCategoryIconFile(file)}
                                    folderPath="uploads/technology"
                                    height={150}
                                />
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
                                <ImageUpload
                                    label="Icon"
                                    value={itemIconFile || existingItemIconUrl}
                                    onChange={(file) => setItemIconFile(file)}
                                    folderPath="uploads/technology"
                                    height={150}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Use Cases (comma separated)</label>
                                <input name="useCases" className="form-input" value={itemFormData.useCases} onChange={handleItemInputChange} placeholder="e.g. Web Apps, APIs, Mobile" />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input type="checkbox" name="featured" checked={itemFormData.featured} onChange={handleItemInputChange} />
                                    Featured Technology
                                </label>
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
