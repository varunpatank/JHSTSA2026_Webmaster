'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Collection {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  items: CollectionItem[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CollectionItem {
  id: string;
  title: string;
  type: 'resource' | 'event' | 'club' | 'link' | 'note';
  url?: string;
  note?: string;
  addedAt: string;
}

const demoCollections: Collection[] = [
  {
    id: '1',
    name: 'TSA Competition Prep',
    description: 'Resources and links for TSA regionals and state competition',
    icon: '🏆',
    color: 'bg-blue-500',
    isPublic: false,
    createdAt: '2026-01-15',
    updatedAt: '2026-02-08',
    items: [
      { id: '1', title: 'TSA Official Themes', type: 'link', url: 'https://tsaweb.org', addedAt: '2026-01-15' },
      { id: '2', title: 'Webmaster Rubric PDF', type: 'resource', url: '/hub/rubrics/webmaster', addedAt: '2026-01-16' },
      { id: '3', title: 'Previous Winners Gallery', type: 'link', url: 'https://tsaweb.org', addedAt: '2026-01-20' },
      { id: '4', title: 'Team meeting notes', type: 'note', note: 'Discuss theme interpretation on Monday', addedAt: '2026-02-05' },
    ]
  },
  {
    id: '2',
    name: 'Leadership Resources',
    description: 'Books, videos, and articles about effective leadership',
    icon: '📚',
    color: 'bg-purple-500',
    isPublic: true,
    createdAt: '2026-01-20',
    updatedAt: '2026-02-06',
    items: [
      { id: '5', title: 'TED Talk: How Great Leaders Inspire', type: 'link', url: 'https://ted.com', addedAt: '2026-01-20' },
      { id: '6', title: 'Student Council Handbook', type: 'resource', addedAt: '2026-01-22' },
      { id: '7', title: 'Meeting Facilitation Tips', type: 'note', note: 'Use round-robin for equal participation', addedAt: '2026-02-01' },
    ]
  },
  {
    id: '3',
    name: 'Fundraising Ideas',
    description: 'Creative ways to raise money for club activities',
    icon: '💰',
    color: 'bg-green-500',
    isPublic: true,
    createdAt: '2026-02-01',
    updatedAt: '2026-02-07',
    items: [
      { id: '8', title: 'GoFundMe for Clubs', type: 'link', url: 'https://gofundme.com', addedAt: '2026-02-01' },
      { id: '9', title: 'Bake Sale Planning Template', type: 'resource', addedAt: '2026-02-03' },
    ]
  }
];

export default function MyCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>(demoCollections);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newCollection, setNewCollection] = useState({ name: '', description: '', icon: '📁', color: 'bg-primary-500', isPublic: false });
  const [newItem, setNewItem] = useState({ title: '', type: 'link' as CollectionItem['type'], url: '', note: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const iconOptions = ['📁', '🏆', '📚', '💡', '🎯', '⭐', '💰', '🎨', '🔬', '🌍', '🎵', '💻', '📝', '🤝', '🎓'];
  const colorOptions = [
    { value: 'bg-primary-500', label: 'Navy' },
    { value: 'bg-secondary-500', label: 'Gold' },
    { value: 'bg-accent-500', label: 'Maroon' },
    { value: 'bg-blue-500', label: 'Blue' },
    { value: 'bg-green-500', label: 'Green' },
    { value: 'bg-purple-500', label: 'Purple' },
    { value: 'bg-pink-500', label: 'Pink' },
    { value: 'bg-orange-500', label: 'Orange' },
  ];

  const createCollection = () => {
    if (!newCollection.name.trim()) return;
    const collection: Collection = {
      id: Date.now().toString(),
      name: newCollection.name,
      description: newCollection.description,
      icon: newCollection.icon,
      color: newCollection.color,
      isPublic: newCollection.isPublic,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      items: []
    };
    setCollections([...collections, collection]);
    setNewCollection({ name: '', description: '', icon: '📁', color: 'bg-primary-500', isPublic: false });
    setIsCreating(false);
    setSelectedCollection(collection);
  };

  const addItemToCollection = () => {
    if (!selectedCollection || !newItem.title.trim()) return;
    const item: CollectionItem = {
      id: Date.now().toString(),
      title: newItem.title,
      type: newItem.type,
      url: newItem.url || undefined,
      note: newItem.note || undefined,
      addedAt: new Date().toISOString().split('T')[0]
    };
    const updated = collections.map(c => 
      c.id === selectedCollection.id 
        ? { ...c, items: [...c.items, item], updatedAt: new Date().toISOString().split('T')[0] }
        : c
    );
    setCollections(updated);
    setSelectedCollection({ ...selectedCollection, items: [...selectedCollection.items, item] });
    setNewItem({ title: '', type: 'link', url: '', note: '' });
    setIsAddingItem(false);
  };

  const removeItem = (itemId: string) => {
    if (!selectedCollection) return;
    const updatedItems = selectedCollection.items.filter(item => item.id !== itemId);
    const updated = collections.map(c => 
      c.id === selectedCollection.id 
        ? { ...c, items: updatedItems, updatedAt: new Date().toISOString().split('T')[0] }
        : c
    );
    setCollections(updated);
    setSelectedCollection({ ...selectedCollection, items: updatedItems });
  };

  const deleteCollection = (collectionId: string) => {
    setCollections(collections.filter(c => c.id !== collectionId));
    if (selectedCollection?.id === collectionId) {
      setSelectedCollection(null);
    }
  };

  const togglePublic = (collectionId: string) => {
    const updated = collections.map(c => 
      c.id === collectionId ? { ...c, isPublic: !c.isPublic } : c
    );
    setCollections(updated);
    if (selectedCollection?.id === collectionId) {
      setSelectedCollection({ ...selectedCollection, isPublic: !selectedCollection.isPublic });
    }
  };

  const typeIcons: Record<string, string> = {
    'resource': '📄',
    'event': '📅',
    'club': '👥',
    'link': '🔗',
    'note': '📝'
  };

  const filteredCollections = collections.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1920&q=80"
            alt="Collections"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/95 to-purple-600/80"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <Link href="/hub" className="text-white/80 hover:text-white text-sm mb-4 inline-flex items-center gap-2">
            ← Back to Hub
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-white">
            📂 My Collections
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Organize your favorite resources, links, and notes into custom collections.
            Share your curated lists with others or keep them private.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar - Collections List */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="card p-4 sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-primary-500">Collections</h2>
                  <button
                    onClick={() => setIsCreating(true)}
                    className="text-sm bg-primary-500 text-white px-3 py-1 font-semibold hover:bg-primary-600 transition-colors"
                  >
                    + New
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Search collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field mb-4"
                />

                <div className="space-y-2">
                  {filteredCollections.map(collection => (
                    <button
                      key={collection.id}
                      onClick={() => setSelectedCollection(collection)}
                      className={`w-full text-left p-3 border transition-all flex items-center gap-3 ${
                        selectedCollection?.id === collection.id
                          ? 'border-primary-400 bg-primary-50'
                          : 'border-neutral-200 hover:border-primary-300 bg-white'
                      }`}
                    >
                      <span className={`w-10 h-10 ${collection.color} text-white flex items-center justify-center text-xl`}>
                        {collection.icon}
                      </span>
                      <div className="flex-grow min-w-0">
                        <div className="font-semibold text-neutral-700 truncate">{collection.name}</div>
                        <div className="text-xs text-neutral-500">{collection.items.length} items</div>
                      </div>
                      {collection.isPublic && (
                        <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5">Public</span>
                      )}
                    </button>
                  ))}

                  {filteredCollections.length === 0 && (
                    <div className="text-center py-8 text-neutral-500">
                      <div className="text-3xl mb-2">📁</div>
                      <p className="text-sm">No collections found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-grow">
              {/* Create Collection Modal */}
              {isCreating && (
                <div className="card p-6 mb-6 border-2 border-primary-300">
                  <h3 className="text-lg font-bold text-primary-500 mb-4">Create New Collection</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">Collection Name *</label>
                      <input
                        type="text"
                        value={newCollection.name}
                        onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                        placeholder="e.g., Competition Resources"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">Description</label>
                      <textarea
                        value={newCollection.description}
                        onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                        placeholder="What's this collection about?"
                        className="input-field"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1">Icon</label>
                        <div className="flex flex-wrap gap-1">
                          {iconOptions.map(icon => (
                            <button
                              key={icon}
                              onClick={() => setNewCollection({ ...newCollection, icon })}
                              className={`w-8 h-8 text-lg border transition-all ${
                                newCollection.icon === icon 
                                  ? 'border-primary-500 bg-primary-50' 
                                  : 'border-neutral-200 hover:border-neutral-300'
                              }`}
                            >
                              {icon}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1">Color</label>
                        <div className="flex flex-wrap gap-1">
                          {colorOptions.map(color => (
                            <button
                              key={color.value}
                              onClick={() => setNewCollection({ ...newCollection, color: color.value })}
                              className={`w-8 h-8 ${color.value} border-2 transition-all ${
                                newCollection.color === color.value 
                                  ? 'border-neutral-800 scale-110' 
                                  : 'border-transparent'
                              }`}
                              title={color.label}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newCollection.isPublic}
                        onChange={(e) => setNewCollection({ ...newCollection, isPublic: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-neutral-700">Make this collection public</span>
                    </label>
                    <div className="flex gap-3">
                      <button onClick={createCollection} className="btn-primary">
                        Create Collection
                      </button>
                      <button onClick={() => setIsCreating(false)} className="btn-outline">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Selected Collection View */}
              {selectedCollection ? (
                <div className="card p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <span className={`w-16 h-16 ${selectedCollection.color} text-white flex items-center justify-center text-3xl`}>
                      {selectedCollection.icon}
                    </span>
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-bold font-heading text-primary-500">{selectedCollection.name}</h2>
                        {selectedCollection.isPublic && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold">Public</span>
                        )}
                      </div>
                      <p className="text-neutral-600">{selectedCollection.description}</p>
                      <p className="text-xs text-neutral-400 mt-1">
                        Created {selectedCollection.createdAt} • Last updated {selectedCollection.updatedAt}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => togglePublic(selectedCollection.id)}
                        className={`px-3 py-1.5 text-sm font-semibold border transition-colors ${
                          selectedCollection.isPublic
                            ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200'
                            : 'bg-neutral-100 text-neutral-600 border-neutral-300 hover:bg-neutral-200'
                        }`}
                      >
                        {selectedCollection.isPublic ? '🌐 Public' : '🔒 Private'}
                      </button>
                      <button
                        onClick={() => deleteCollection(selectedCollection.id)}
                        className="px-3 py-1.5 text-sm font-semibold bg-red-100 text-red-600 border border-red-300 hover:bg-red-200 transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>

                  {/* Add Item Button */}
                  <div className="mb-6">
                    <button
                      onClick={() => setIsAddingItem(true)}
                      className="btn-primary"
                    >
                      + Add Item
                    </button>
                  </div>

                  {/* Add Item Form */}
                  {isAddingItem && (
                    <div className="p-4 bg-neutral-50 border border-neutral-200 mb-6">
                      <h4 className="font-bold text-neutral-700 mb-3">Add New Item</h4>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-semibold text-neutral-700 mb-1">Title *</label>
                          <input
                            type="text"
                            value={newItem.title}
                            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                            placeholder="Item title"
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-neutral-700 mb-1">Type</label>
                          <select
                            value={newItem.type}
                            onChange={(e) => setNewItem({ ...newItem, type: e.target.value as CollectionItem['type'] })}
                            className="select-field"
                          >
                            <option value="link">🔗 Link</option>
                            <option value="resource">📄 Resource</option>
                            <option value="event">📅 Event</option>
                            <option value="club">👥 Club</option>
                            <option value="note">📝 Note</option>
                          </select>
                        </div>
                      </div>
                      {(newItem.type === 'link' || newItem.type === 'resource') && (
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-neutral-700 mb-1">URL</label>
                          <input
                            type="url"
                            value={newItem.url}
                            onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                            placeholder="https://..."
                            className="input-field"
                          />
                        </div>
                      )}
                      {newItem.type === 'note' && (
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-neutral-700 mb-1">Note Content</label>
                          <textarea
                            value={newItem.note}
                            onChange={(e) => setNewItem({ ...newItem, note: e.target.value })}
                            placeholder="Your note..."
                            className="input-field"
                            rows={3}
                          />
                        </div>
                      )}
                      <div className="flex gap-3">
                        <button onClick={addItemToCollection} className="btn-primary text-sm">
                          Add Item
                        </button>
                        <button onClick={() => setIsAddingItem(false)} className="btn-outline text-sm">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Items List */}
                  {selectedCollection.items.length > 0 ? (
                    <div className="space-y-3">
                      {selectedCollection.items.map(item => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border border-neutral-200 hover:border-primary-300 transition-colors bg-white">
                          <span className="text-2xl">{typeIcons[item.type]}</span>
                          <div className="flex-grow">
                            <h4 className="font-semibold text-neutral-700">{item.title}</h4>
                            {item.url && (
                              <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-primary-500 hover:underline"
                              >
                                {item.url} ↗
                              </a>
                            )}
                            {item.note && (
                              <p className="text-sm text-neutral-600 italic">{item.note}</p>
                            )}
                            <p className="text-xs text-neutral-400">Added {item.addedAt}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-400 hover:text-red-600 transition-colors p-2"
                            title="Remove item"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-neutral-50 border border-dashed border-neutral-300">
                      <div className="text-5xl mb-4">📭</div>
                      <h3 className="text-lg font-bold text-neutral-600 mb-2">This collection is empty</h3>
                      <p className="text-neutral-500 mb-4">Start adding items to organize your resources</p>
                      <button onClick={() => setIsAddingItem(true)} className="btn-primary">
                        + Add First Item
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="card p-12 text-center">
                  <div className="text-6xl mb-4">📂</div>
                  <h3 className="text-xl font-bold text-neutral-700 mb-2">Select or Create a Collection</h3>
                  <p className="text-neutral-600 mb-6">
                    Choose a collection from the sidebar or create a new one to get started
                  </p>
                  <button onClick={() => setIsCreating(true)} className="btn-primary">
                    + Create New Collection
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-12 bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold font-heading text-primary-500 text-center mb-8">Collection Tips</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="text-4xl mb-3">🔗</div>
              <h3 className="font-bold text-neutral-700 mb-2">Save External Links</h3>
              <p className="text-sm text-neutral-600">
                Bookmark useful websites, tools, and resources you find online
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="font-bold text-neutral-700 mb-2">Add Personal Notes</h3>
              <p className="text-sm text-neutral-600">
                Keep track of ideas, reminders, and personal insights
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-3">🌐</div>
              <h3 className="font-bold text-neutral-700 mb-2">Share with Others</h3>
              <p className="text-sm text-neutral-600">
                Make collections public to help fellow club members
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
