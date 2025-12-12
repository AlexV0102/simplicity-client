import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getAnnouncementById, createAnnouncement, updateAnnouncement } from '../api/announcements';
import { AVAILABLE_CATEGORIES } from '../config/categories';
import styles from './EditAnnouncement.module.css';

export default function EditAnnouncement() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [publicationDate, setPublicationDate] = useState('');
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditMode && id) {
      const fetchAnnouncement = async () => {
        try {
          const announcement = await getAnnouncementById(id);
          if (announcement) {
            setTitle(announcement.title);
            setContent(announcement.content || '');
            setCategories(announcement.categories);
            const date = new Date(announcement.createdAt);
            setPublicationDate(date.toISOString().slice(0, 16));
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load announcement');
        } finally {
          setLoading(false);
        }
      };
      fetchAnnouncement();
    } else {
      const now = new Date();
      setPublicationDate(now.toISOString().slice(0, 16));
    }
  }, [id, isEditMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCategoryDropdown(false);
      }
    };

    if (showCategoryDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCategoryDropdown]);

  const handleAddCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
    setShowCategoryDropdown(false);
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    setCategories(categories.filter((cat) => cat !== categoryToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (isEditMode && id) {
        await updateAnnouncement({
          id,
          title,
          categories,
          content: content || undefined,
        });
      } else {
        await createAnnouncement({
          title,
          categories,
          content: content || undefined,
        });
      }
      navigate('/announcements', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save announcement');
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {isEditMode ? 'Edit the announcement' : 'Create announcement'}
      </h1>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="title" className={styles.label}>
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="content" className={styles.label}>
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={styles.textarea}
            rows={6}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="category" className={styles.label}>
            Category
          </label>
          <p className={styles.helperText}>
            Select category so readers know what your announcement is about.
          </p>
          <div className={styles.categoryContainer} ref={categoryDropdownRef}>
            <div className={styles.categoryInputWrapper}>
              {categories.length > 0 && (
                <div className={styles.categoryTags}>
                  {categories.map((category) => (
                    <span key={category} className={styles.categoryTag}>
                      {category}
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(category)}
                        className={styles.categoryRemove}
                        aria-label={`Remove ${category}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className={styles.categoryInputContainer}>
                <input
                  id="category"
                  type="text"
                  placeholder={categories.length === 0 ? 'Select categories...' : ''}
                  className={styles.categoryInput}
                  onFocus={() => setShowCategoryDropdown(true)}
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className={styles.categoryDropdownButton}
                  aria-label="Toggle category dropdown"
                >
                  ▼
                </button>
              </div>
            </div>
            {showCategoryDropdown && (
              <div className={styles.categoryDropdown}>
                {AVAILABLE_CATEGORIES.filter((cat) => !categories.includes(cat)).map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleAddCategory(category)}
                    className={styles.categoryOption}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="publicationDate" className={styles.label}>
            Publication date
          </label>
          <input
            id="publicationDate"
            type="datetime-local"
            value={publicationDate}
            onChange={(e) => setPublicationDate(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => navigate('/announcements')}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button type="submit" className={styles.publishButton} disabled={saving}>
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  );
}
