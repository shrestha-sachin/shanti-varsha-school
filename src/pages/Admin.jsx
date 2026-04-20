import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

import { useNavigate } from 'react-router-dom'
import { 
  UsersIcon, Bell, GraduationCap, Settings, Plus, X, Trash2, Edit, Save, 
  Search, Filter, LogOut, ChevronRight, Image, Layout, List, FileText, Newspaper,
  MapPin, Phone, Mail, Globe, Clock, Info, CheckCircle2, AlertCircle, Loader2,
  Table, Pin, Maximize2, Download, Calendar, BookOpen, TrendingUp, Eye, EyeOff, Award, User, Quote, Upload, GripVertical, Menu, Library
} from 'lucide-react'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import ImageResize from 'quill-image-resize-module-react'
import { supabase } from '../supabaseClient'

// Registering ImageResize module for Quill
Quill.register('modules/imageResize', ImageResize)

const QUILL_MODULES = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link', 'image'],
    ['clean']
  ],
  imageResize: {
     modules: ['Resize', 'DisplaySize', 'Toolbar']
  }
}

// ── helpers ──────────────────────────────────────────────────────────────────
const NOTICE_CATEGORIES = ['General', 'Exam', 'Event', 'Urgent', 'Meeting']
const EVENT_TYPES = ['Academic', 'Exam', 'Event', 'Meeting', 'Holiday', 'Sports']
const NEWS_CATEGORIES = ['School News', 'Academic', 'Sports', 'Arts', 'Achievement', 'Community']
const ARTICLE_TAGS = ['Education', 'Tips', 'Announcement', 'Achievement', 'Community', 'Technology']

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) || initial }
    catch { return initial }
  })
  const set = (v) => {
    setValue(v)
    localStorage.setItem(key, JSON.stringify(v))
    window.dispatchEvent(new Event(key + 'Updated'))
  }
  return [value, set]
}

function Toast({ msg }) {
  if (!msg.text) return null
  return (
    <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border animate-fade-in-up text-sm font-semibold ${msg.type === 'success'
        ? 'bg-success-light border-success/40 text-green-800'
        : 'bg-danger-light border-danger/40 text-red-800'
      }`}>
      {msg.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-success" /> : <AlertCircle className="h-5 w-5 text-danger" />}
      {msg.text}
    </div>
  )
}

function SectionIcon({ icon: Icon, className = '' }) {
  return (
    <div className={`bg-gradient-to-br from-gold/20 to-gold/10 p-3 rounded-xl flex-shrink-0 ${className}`}>
      <Icon className="h-6 w-6 text-gold" />
    </div>
  )
}

function AdminModal({ isOpen, onClose, title, children, icon: Icon }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-[100] bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            {Icon && <div className="p-2 bg-gold/10 rounded-lg"><Icon className="h-5 w-5 text-gold" /></div>}
            <h3 className="font-display font-bold text-navy text-xl">{title}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-navy"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  )
}

// ── Crop helper ───────────────────────────────────────────────────────────────
function CropModal({ src, onDone, onCancel }) {
  const wrapRef = React.useRef(null)
  const imgRef = React.useRef(null)
  const [imgReady, setImgReady] = useState(false)
  const [ratio, setRatio] = useState(null) // null = free, 1 = square, etc.
  const [box, setBox] = useState({ left: 0.1, top: 0.1, width: 0.8, height: 0.8 }) // fractions 0–1 of rendered image
  const [drag, setDrag] = useState(null)

  // Whenever ratio changes, conform box to new aspect ratio mathematically
  useEffect(() => {
    if (ratio && imgReady && imgRef.current) {
      const r = imgRef.current.getBoundingClientRect()
      const wPx = box.width * r.width
      const targetHPx = wPx / ratio
      setBox(b => ({ ...b, height: Math.min(targetHPx / r.height, 1 - b.top) }))
    }
  }, [ratio, imgReady])

  // Get the bounding rect of the rendered image inside the container
  const getImgRect = () => {
    const img = imgRef.current
    if (!img) return null
    return img.getBoundingClientRect()
  }

  const toFrac = (clientX, clientY) => {
    const r = getImgRect()
    if (!r) return { fx: 0, fy: 0 }
    return {
      fx: Math.max(0, Math.min(1, (clientX - r.left) / r.width)),
      fy: Math.max(0, Math.min(1, (clientY - r.top) / r.height))
    }
  }

  const onDown = (e, targetMode = 'move') => {
    e.preventDefault()
    e.stopPropagation()
    const cx = e.touches ? e.touches[0].clientX : e.clientX
    const cy = e.touches ? e.touches[0].clientY : e.clientY
    const { fx, fy } = toFrac(cx, cy)

    if (targetMode === 'resize') {
      setDrag({ mode: 'resize', anchorFx: box.left, anchorFy: box.top })
    } else {
      if (fx >= box.left && fx <= box.left + box.width && fy >= box.top && fy <= box.top + box.height) {
        setDrag({ mode: 'move', startFx: fx - box.left, startFy: fy - box.top })
      }
    }
  }

  const onMove = (e) => {
    if (!drag) return
    e.preventDefault()
    const cx = e.touches ? e.touches[0].clientX : e.clientX
    const cy = e.touches ? e.touches[0].clientY : e.clientY
    const { fx, fy } = toFrac(cx, cy)
    const r = getImgRect()
    if (!r) return
    
    if (drag.mode === 'move') {
      const newLeft = Math.max(0, Math.min(1 - box.width, fx - drag.startFx))
      const newTop = Math.max(0, Math.min(1 - box.height, fy - drag.startFy))
      setBox(b => ({ ...b, left: newLeft, top: newTop }))
    } else if (drag.mode === 'resize') {
      let newW = fx - drag.anchorFx
      let newH = fy - drag.anchorFy

      if (ratio) {
        const maxDeltaPx = Math.max(newW * r.width, (newH * r.height) * ratio)
        newW = maxDeltaPx / r.width
        newH = (maxDeltaPx / ratio) / r.height
        if (newW > 1 - drag.anchorFx) {
          newW = 1 - drag.anchorFx
          newH = (newW * r.width / ratio) / r.height
        }
        if (newH > 1 - drag.anchorFy) {
          newH = 1 - drag.anchorFy
          newW = (newH * r.height * ratio) / r.width
        }
      }
      newW = Math.max(0.05, newW)
      newH = Math.max(0.05, newH)
      setBox(b => ({ ...b, width: newW, height: newH }))
    }
  }

  const onUp = () => setDrag(null)

  const applyCrop = () => {
    const img = imgRef.current
    if (!img) { onDone(null); return }

    // Map fractional crop box → natural image pixels
    const sx = box.left * img.naturalWidth
    const sy = box.top * img.naturalHeight
    const sw = box.width * img.naturalWidth
    const sh = box.height * img.naturalHeight

    const outW = 800
    const outH = ratio ? (800 / ratio) : (800 * (sh / sw))
    
    const canvas = document.createElement('canvas')
    canvas.width = outW
    canvas.height = outH
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH)

    const result = canvas.toDataURL('image/jpeg', 0.92)
    onDone(result)
  }

  const cropStyle = {
    position: 'absolute',
    left: `${box.left * 100}%`,
    top: `${box.top * 100}%`,
    width: `${box.width * 100}%`,
    height: `${box.height * 100}%`,
    border: '3px solid white',
    boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
    cursor: 'move',
    zIndex: 10
  }

  const modalContent = (
    <div className="fixed inset-0 z-[200] bg-navy/80 backdrop-blur-sm overflow-y-auto p-4 md:p-10 flex">
      <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl m-auto shrink-0 animate-scale-in">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between overflow-x-auto gap-4 custom-scrollbar">
          <h3 className="font-display font-bold text-navy text-lg whitespace-nowrap hidden sm:block">Editor</h3>
          <div className="flex gap-2 shrink-0">
            <button type="button" onClick={() => setRatio(null)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${ratio===null?'bg-navy text-white shadow-md':'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>Free</button>
            <button type="button" onClick={() => setRatio(1)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${ratio===1?'bg-navy text-white shadow-md':'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>1:1 Square</button>
            <button type="button" onClick={() => setRatio(4/3)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${ratio===4/3?'bg-navy text-white shadow-md':'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>4:3</button>
            <button type="button" onClick={() => setRatio(16/9)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${ratio===16/9?'bg-navy text-white shadow-md':'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>16:9</button>
          </div>
          <button type="button" onClick={onCancel} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full shrink-0 transition-colors"><X className="h-5 w-5" /></button>
        </div>

        <div
          className="relative bg-gray-900 overflow-hidden select-none flex items-center justify-center p-4"
          style={{ minHeight: 320 }}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          onTouchMove={onMove}
          onTouchEnd={onUp}
        >
          {!imgReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/50 bg-gray-900 z-20">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-xs">Loading image...</p>
            </div>
          )}
          
          <div ref={wrapRef} className="relative inline-block leading-none" style={{ fontSize: 0 }}>
            <img
              ref={imgRef}
              src={src}
              alt="crop preview"
              onLoad={() => {
                console.log('[CropModal] Image loaded:', imgRef.current.naturalWidth, 'x', imgRef.current.naturalHeight)
                setImgReady(true)
              }}
              onError={(e) => {
                console.error('[CropModal] Image failed to load', e)
                alert('Failed to load image for cropping. This link may be broken or restricted.')
                onCancel()
              }}
              className={`block w-auto h-auto max-w-full max-h-[400px] object-contain transition-opacity duration-300 ${imgReady ? 'opacity-100' : 'opacity-0'}`}
              draggable={false}
            />

            {imgReady && (
              <div
                style={cropStyle}
                onMouseDown={(e) => onDown(e, 'move')}
                onTouchStart={(e) => onDown(e, 'move')}
              >
                {/* Rule-of-thirds grid */}
                <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr 1fr', pointerEvents: 'none' }}>
                  {[...Array(9)].map((_, i) => <div key={i} style={{ border: '1px solid rgba(255,255,255,0.4)', borderRight: i % 3 === 2 ? 'none' : '1px solid rgba(255,255,255,0.4)', borderBottom: i > 5 ? 'none' : '1px solid rgba(255,255,255,0.4)' }} />)}
                </div>
                {/* Resize Handle */}
                <div 
                  style={{ position: 'absolute', bottom: -6, right: -6, width: 20, height: 20, backgroundColor: 'white', borderRadius: '50%', cursor: 'se-resize', boxShadow: '0 2px 4px rgba(0,0,0,0.4)', pointerEvents: 'auto', border: '2px solid #072f6e', zIndex: 50 }}
                  onMouseDown={(e) => onDown(e, 'resize')}
                  onTouchStart={(e) => onDown(e, 'resize')}
                />
              </div>
            )}
          </div>
        </div>

        <div className="p-5">
          {imgReady && <p className="text-xs text-gray-500 mb-4 text-center">Drag edges to frame your photo or choose an aspect ratio above</p>}
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              type="button"
              onClick={applyCrop} 
              disabled={!imgReady}
              className={`btn-gold flex-1 py-3 font-bold transition-all ${!imgReady ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'}`}
            >
              Upload Cropped
            </button>
            <button 
              type="button"
              onClick={() => onDone(src)} 
              disabled={!imgReady}
              className={`flex-1 py-3 bg-navy hover:bg-navy-dark text-white rounded-2xl font-bold transition-all shadow-md ${!imgReady ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'}`}
            >
              Upload Original
            </button>
          </div>
        </div>
      </div>
    </div>
  )
  
  return createPortal(modalContent, document.body)
}

// ── File Uploader ─────────────────────────────────────────────────────────────
function FileUploader({ onUpload, currentUrl, label = "Upload Image", folder = "profile", type = "image" }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentUrl)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [cropSrc, setCropSrc] = useState(null)
  const uid = `uploader-${(label + folder).replace(/\s+/g, '-').toLowerCase()}`

  useEffect(() => { setPreview(currentUrl) }, [currentUrl])

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setError(null)
    setSuccess(false)
    
    // If it's an image and we are in image mode (or it's an image in 'all' mode), show cropper
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => setCropSrc(reader.result)
      reader.readAsDataURL(file)
    } else {
      // It's a document, upload directly without cropping
      doUploadFile(file)
    }
  }

  const doUploadFile = async (file) => {
    try {
      setUploading(true)
      setError(null)
      const ext = file.name.split('.').pop()
      const path = `${folder}/${Date.now()}.${ext}`
      
      const { error: uploadErr } = await supabase.storage
        .from('school-assets')
        .upload(path, file, { contentType: file.type, upsert: true })

      if (uploadErr) throw uploadErr

      const { data: urlData } = supabase.storage.from('school-assets').getPublicUrl(path)
      setPreview(urlData.publicUrl)
      setSuccess(true)
      onUpload(urlData.publicUrl)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const doUpload = async (dataUrl) => {
    setCropSrc(null)
    if (!dataUrl) return

    setPreview(dataUrl) // show cropped version immediately as preview
    try {
      setUploading(true)
      setError(null)

      // Convert dataUrl → blob
      const res = await fetch(dataUrl)
      const blob = await res.blob()

      const path = `${folder}/${Date.now()}.jpg`
      const { error: uploadErr } = await supabase.storage
        .from('school-assets')
        .upload(path, blob, { contentType: 'image/jpeg', upsert: true })

      if (uploadErr) throw uploadErr

      const { data: urlData } = supabase.storage.from('school-assets').getPublicUrl(path)
      setPreview(urlData.publicUrl)
      setSuccess(true)
      onUpload(urlData.publicUrl)
    } catch (err) {
      setError(err.message)
      setPreview(currentUrl)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-all">
        <div className="w-20 h-20 rounded-2xl bg-white border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-sm relative">
          {preview ? (
            preview.match(/\.(jpg|jpeg|png|gif|webp)/i) ? (
              <img src={preview} className="w-full h-full object-cover" alt="preview" onError={() => setPreview(null)} />
            ) : (
              <div className="flex flex-col items-center justify-center bg-gray-50 h-full w-full">
                 <FileText className="h-8 w-8 text-gold" />
                 <span className="text-[8px] font-bold text-gray-400 mt-1 uppercase">DOC/PDF</span>
              </div>
            )
          ) : (
            <Upload className="h-7 w-7 text-gray-300" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <input 
            type="file" 
            id={uid} 
            accept={type === 'image' ? "image/jpeg,image/png,image/webp" : "image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"} 
            onChange={handleChange} 
            disabled={uploading} 
            className="hidden" 
          />
          <label htmlFor={uid} className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-bold text-navy hover:border-gold hover:text-gold transition-all shadow-sm">
            {uploading ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</> : <><Plus className="h-4 w-4" /> {preview ? 'Change File' : 'Choose File'}</>}
          </label>
          <p className="text-[10px] text-gray-400 mt-1.5 italic">
            {type === 'image' ? 'JPG, PNG, WEBP — tap to crop' : 'Images, PDF, DOCX, XLSX'}
          </p>
          {success && !error && <p className="text-[11px] text-green-600 font-bold mt-1">✓ Uploaded! Click Save to apply.</p>}
          {error && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-[11px] text-red-700 font-bold">✗ Upload failed</p>
              <p className="text-[10px] text-red-500 mt-0.5">{error}</p>
            </div>
          )}
        </div>
      </div>
      {cropSrc && <CropModal src={cropSrc} onDone={doUpload} onCancel={() => setCropSrc(null)} />}
    </div>
  )
}

function EmptyState({ message = 'No items yet.' }) {
  return <p className="text-gray-400 text-center py-12 text-sm italic">{message}</p>
}

// ── NOTICE TAB ────────────────────────────────────────────────────────────────
function NoticesTab({ toast }) {
  const [notices, setNotices] = useState([])
  const [form, setForm] = useState({ 
    title: '', 
    date: today(), 
    category: 'General', 
    description: '', 
    pinned: false,
    file_url: '',
    external_link: ''
  })
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)

  function today() { return new Date().toISOString().split('T')[0] }

  const fetchNotices = async () => {
    setLoading(true)
    const { data } = await supabase.from('school_notices').select('*').order('pinned', { ascending: false }).order('date', { ascending: false })
    if (data) setNotices(data)
    setLoading(false)
  }

  useEffect(() => { fetchNotices() }, [])

  const save = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast({ type: 'error', text: 'Title is required.' })
    
    const payload = { ...form }
    const { error } = await supabase.from('school_notices').upsert(editing ? { ...payload, id: editing.id } : [payload])
    
    if (error) {
      toast({ type: 'error', text: `Failed: ${error.message}` })
    } else {
      toast({ type: 'success', text: editing ? 'Notice updated!' : 'Notice added!' })
      setEditing(null)
      setForm({ 
        title: '', 
        date: today(), 
        category: 'General', 
        description: '', 
        pinned: false,
        file_url: '',
        external_link: ''
      })
      fetchNotices()
    }
  }

  const startEdit = (n) => { 
    setEditing(n); 
    setForm({ 
      title: n.title, 
      date: n.date, 
      category: n.category || 'General', 
      description: n.description || '', 
      pinned: !!n.pinned,
      file_url: n.file_url || '',
      external_link: n.external_link || ''
    }) 
  }
  const del = async (id) => { 
    if (confirm('Delete this notice?')) { 
      const { error } = await supabase.from('school_notices').delete().eq('id', id)
      if (error) toast({ type: 'error', text: error.message })
      else { toast({ type: 'success', text: 'Deleted.' }); fetchNotices() } 
    } 
  }
  const cancel = () => { setEditing(null); setForm({ title: '', date: today(), category: 'General', description: '', pinned: false, file_url: '', external_link: '' }) }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <SectionIcon icon={Bell} />
          <h3 className="font-display font-bold text-navy text-xl">{editing ? 'Edit Notice' : 'Add New Notice'}</h3>
        </div>
        <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label-modern">Notice Title *</label>
            <input className="input-modern" placeholder="Headline" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          </div>
          <div>
            <label className="label-modern">Date</label>
            <input type="date" className="input-modern" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
          </div>
          <div>
            <label className="label-modern">Category</label>
            <select className="input-modern" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
              {NOTICE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="label-modern">Attach Document/Photo</label>
            <FileUploader 
              label="PDF, DOCX or Image" 
              folder="notices" 
              type="all"
              currentUrl={form.file_url} 
              onUpload={url => setForm(p => ({ ...p, file_url: url }))} 
            />
          </div>
          <div className="md:col-span-1">
            <label className="label-modern">External Link (Optional)</label>
            <input 
              className="input-modern" 
              placeholder="e.g. https://google.com" 
              value={form.external_link} 
              onChange={e => setForm(p => ({ ...p, external_link: e.target.value }))} 
            />
            <p className="text-[10px] text-gray-400 mt-2">Useful for YouTube links or external news</p>
          </div>
          <div className="md:col-span-2">
            <label className="label-modern">Detail Description (Optional)</label>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
               <ReactQuill 
                 theme="snow" 
                 modules={QUILL_MODULES}
                 value={form.description} 
                 onChange={val => setForm(p => ({ ...p, description: val }))}
                 className="min-h-[150px] font-sans"
               />
            </div>
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="btn-gold w-full">{editing ? 'Update' : 'Add'} Notice</button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <h3 className="font-display font-bold text-navy text-xl mb-5">Active Notices ({notices.length})</h3>
        {loading ? <EmptyState message="Loading..." /> : notices.length === 0 ? <EmptyState message="Zero notices in database." /> : (
          <div className="space-y-3">
            {notices.map(n => (
              <div key={n.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gold/30 hover:bg-gray-50 transition-all">
                <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-2 mb-1">
                     <span className={`badge ${n.category === 'Urgent' ? 'badge-urgent' : 'badge-general'} text-[11px]`}>{n.category}</span>
                     {n.pinned && <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full"><Pin className="h-2.5 w-2.5" /> Pinned</span>}
                   </div>
                   <p className="font-semibold text-navy text-sm truncate">{n.title}</p>
                   <p className="text-xs text-gray-400 mt-0.5">{n.date}</p>
                </div>
                <div className="flex items-center gap-1 ml-3">
                   <button onClick={async () => { await supabase.from('school_notices').update({ pinned: !n.pinned }).eq('id', n.id); fetchNotices() }} className="p-2 text-gray-400 hover:text-gold hover:bg-gold/10 rounded-lg transition-all" title={n.pinned ? 'Unpin' : 'Pin'}>
                     <Pin className={`h-4 w-4 ${n.pinned ? 'text-gold fill-gold' : ''}`} />
                   </button>
                   <button onClick={() => startEdit(n)} className="p-2 text-navy hover:bg-gold/10 hover:text-gold rounded-lg transition-all"><Edit className="h-4 w-4" /></button>
                   <button onClick={() => del(n.id)} className="p-2 text-danger hover:bg-danger-light rounded-lg transition-all"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── NEWS TAB ──────────────────────────────────────────────────────────────────
function NewsTab({ toast }) {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', category: 'School News', content: '', image_url: '', date: today(), published: true })
  const [editing, setEditing] = useState(null)

  function today() { return new Date().toISOString().split('T')[0] }

  const fetchNews = async () => {
    setLoading(true)
    const { data } = await supabase.from('school_news').select('*').order('date', { ascending: false })
    if (data) setNews(data)
    setLoading(false)
  }

  useEffect(() => { fetchNews() }, [])

  const save = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast({ type: 'error', text: 'Title is required.' })
    
    const { error } = await supabase.from('school_news').upsert(editing ? { ...form, id: editing.id } : [form])
    
    if (error) {
      toast({ type: 'error', text: `Failed: ${error.message}` })
    } else {
      toast({ type: 'success', text: editing ? 'News updated!' : 'News article added!' })
      setEditing(null)
      setForm({ title: '', category: 'School News', content: '', image_url: '', date: today(), published: true })
      fetchNews()
    }
  }

  const startEdit = (n) => { setEditing(n); setForm({ title: n.title, category: n.category, content: n.content || '', image_url: n.image_url || '', date: n.date, published: !!n.published }) }
  const del = async (id) => { 
    if (confirm('Delete this article?')) { 
      const { error } = await supabase.from('school_news').delete().eq('id', id)
      if (error) toast({ type: 'error', text: error.message })
      else { toast({ type: 'success', text: 'Deleted.' }); fetchNews() } 
    } 
  }
  const cancel = () => { setEditing(null); setForm({ title: '', category: 'School News', content: '', image_url: '', date: today(), published: true }) }
  const togglePublish = async (n) => {
    const { error } = await supabase.from('school_news').update({ published: !n.published }).eq('id', n.id)
    if (!error) fetchNews()
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <SectionIcon icon={Newspaper} />
          <h3 className="font-display font-bold text-navy text-xl">{editing ? 'Edit News Article' : 'Add News Article'}</h3>
        </div>
        <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label-modern">Headline *</label>
            <input className="input-modern" placeholder="e.g. School Wins Regional Award" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          </div>
          <div>
            <label className="label-modern">Category</label>
            <select className="input-modern" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
              {NEWS_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label-modern">Published Date</label>
            <input type="date" className="input-modern" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <FileUploader label="News Cover Image" folder="news" currentUrl={form.image_url} onUpload={(url) => setForm(p => ({ ...p, image_url: url }))} />
          </div>
          <div className="md:col-span-2">
            <label className="label-modern">Content *</label>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
               <ReactQuill 
                 theme="snow" 
                 modules={QUILL_MODULES}
                 value={form.content} 
                 onChange={val => setForm(p => ({ ...p, content: val }))}
                 className="min-h-[250px] font-sans"
               />
            </div>
          </div>
          <div className="md:col-span-2 flex items-center gap-3">
            <input type="checkbox" id="news-published" checked={form.published} onChange={e => setForm(p => ({ ...p, published: e.target.checked }))} className="w-4 h-4 accent-gold" />
            <label htmlFor="news-published" className="text-sm font-medium text-gray-700 cursor-pointer">Publish immediately</label>
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="btn-gold flex-1"><Plus className="h-4 w-4" /> {editing ? 'Update Article' : 'Publish Article'}</button>
            {editing && <button type="button" onClick={cancel} className="px-6 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center gap-2"><X className="h-4 w-4" />Cancel</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <h3 className="font-display font-bold text-navy text-xl mb-5">All News Articles ({news.length})</h3>
        {loading ? <EmptyState message="Loading..." /> : news.length === 0 ? <EmptyState message="No news articles yet." /> : (
          <div className="space-y-3">
            {news.map(n => (
              <div key={n.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gold/30 hover:bg-gray-50 transition-all">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-news text-[11px]">{n.category}</span>
                    {!n.published && <span className="badge text-[11px] bg-gray-100 text-gray-500">Draft</span>}
                  </div>
                  <p className="font-semibold text-navy text-sm truncate">{n.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(n.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-1 ml-3">
                  <button onClick={() => togglePublish(n)} className="p-2 text-gray-400 hover:text-gold hover:bg-gold/10 rounded-lg transition-all" title={n.published ? 'Unpublish' : 'Publish'}>
                    {n.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button onClick={() => startEdit(n)} className="p-2 text-navy hover:bg-gold/10 hover:text-gold rounded-lg transition-all"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => del(n.id)} className="p-2 text-danger hover:bg-danger-light rounded-lg transition-all"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── ARTICLES TAB ──────────────────────────────────────────────────────────────
function ArticlesTab({ toast }) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', author: '', tags: '', body: '', date: today(), published: true })
  const [editing, setEditing] = useState(null)

  function today() { return new Date().toISOString().split('T')[0] }

  const fetchArticles = async () => {
    setLoading(true)
    const { data } = await supabase.from('school_articles').select('*').order('date', { ascending: false })
    if (data) setArticles(data)
    setLoading(false)
  }

  useEffect(() => { fetchArticles() }, [])

  const save = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast({ type: 'error', text: 'Title is required.' })
    const { error } = await supabase.from('school_articles').upsert(editing ? { ...form, id: editing.id } : [form])
    
    if (error) {
      toast({ type: 'error', text: `Failed: ${error.message}` })
    } else {
      toast({ type: 'success', text: editing ? 'Article updated!' : 'Article published!' })
      setEditing(null)
      setForm({ title: '', author: '', tags: '', body: '', date: today(), published: true })
      fetchArticles()
    }
  }

  const startEdit = (a) => { setEditing(a); setForm({ title: a.title, author: a.author || '', tags: a.tags || '', body: a.body || '', date: a.date, published: !!a.published }) }
  const del = async (id) => { 
    if (confirm('Delete this article?')) { 
      const { error } = await supabase.from('school_articles').delete().eq('id', id)
      if (error) toast({ type: 'error', text: error.message })
      else { toast({ type: 'success', text: 'Deleted.' }); fetchArticles() } 
    } 
  }
  const cancel = () => { setEditing(null); setForm({ title: '', author: '', tags: '', body: '', date: today(), published: true }) }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <SectionIcon icon={FileText} />
          <h3 className="font-display font-bold text-navy text-xl">{editing ? 'Edit Article' : 'Write New Article'}</h3>
        </div>
        <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label-modern">Article Title *</label>
            <input className="input-modern" placeholder="e.g. Tips for Better Study Habits" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          </div>
          <div>
            <label className="label-modern">Author</label>
            <input className="input-modern" placeholder="e.g. Principal Name" value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} />
          </div>
          <div>
            <label className="label-modern">Date</label>
            <input type="date" className="input-modern" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <label className="label-modern">Tags (comma separated)</label>
            <input className="input-modern" placeholder="e.g. Education, Tips, Achievement" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <label className="label-modern">Article Body *</label>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
               <ReactQuill 
                 theme="snow" 
                 modules={QUILL_MODULES}
                 value={form.body} 
                 onChange={val => setForm(p => ({ ...p, body: val }))}
                 className="min-h-[350px] font-sans"
               />
            </div>
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="btn-gold flex-1"><Plus className="h-4 w-4" />{editing ? 'Update Article' : 'Publish Article'}</button>
            {editing && <button type="button" onClick={cancel} className="px-6 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center gap-2"><X className="h-4 w-4" />Cancel</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <h3 className="font-display font-bold text-navy text-xl mb-5">All Articles ({articles.length})</h3>
        {loading ? <EmptyState message="Loading..." /> : articles.length === 0 ? <EmptyState message="No articles yet." /> : (
          <div className="space-y-3">
            {articles.map(a => (
              <div key={a.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gold/30 hover:bg-gray-50 transition-all">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!a.published && <span className="badge text-[11px] bg-gray-100 text-gray-500">Draft</span>}
                  </div>
                  <p className="font-semibold text-navy text-sm truncate">{a.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.author ? `By ${a.author} · ` : ''}{new Date(a.date).toLocaleDateString()}</p>
                  {a.tags && <p className="text-xs text-gold mt-1 truncate">{a.tags}</p>}
                </div>
                <div className="flex items-center gap-1 ml-3">
                  <button onClick={async () => { await supabase.from('school_articles').update({ published: !a.published }).eq('id', a.id); fetchArticles() }} className="p-2 text-gray-400 hover:text-gold hover:bg-gold/10 rounded-lg transition-all" title={a.published ? 'Hide' : 'Publish'}>
                    {a.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button onClick={() => startEdit(a)} className="p-2 text-navy hover:bg-gold/10 hover:text-gold rounded-lg transition-all"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => del(a.id)} className="p-2 text-danger hover:bg-danger-light rounded-lg transition-all"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── CALENDAR TAB ──────────────────────────────────────────────────────────────
function CalendarTab({ toast }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', date: today(), type: 'Academic', description: '' })
  const [editing, setEditing] = useState(null)

  function today() { return new Date().toISOString().split('T')[0] }

  const fetchEvents = async () => {
    setLoading(true)
    const { data } = await supabase.from('school_events').select('*').order('date', { ascending: true })
    if (data) setEvents(data)
    setLoading(false)
  }

  useEffect(() => { fetchEvents() }, [])

  const save = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast({ type: 'error', text: 'Title is required.' })
    const { error } = await supabase.from('school_events').upsert(editing ? { ...form, id: editing.id } : [form])
    
    if (error) {
      toast({ type: 'error', text: `Failed: ${error.message}` })
    } else {
      toast({ type: 'success', text: editing ? 'Event updated!' : 'Event added!' })
      setEditing(null)
      setForm({ title: '', date: today(), type: 'Academic', description: '' })
      fetchEvents()
    }
  }

  const startEdit = (ev) => { setEditing(ev); setForm({ title: ev.title, date: ev.date, type: ev.type || 'Academic', description: ev.description || '' }) }
  const del = async (id) => { 
    if (confirm('Delete this event?')) { 
      const { error } = await supabase.from('school_events').delete().eq('id', id)
      if (error) toast({ type: 'error', text: error.message })
      else { toast({ type: 'success', text: 'Deleted.' }); fetchEvents() } 
    } 
  }
  const cancel = () => { setEditing(null); setForm({ title: '', date: today(), type: 'Academic', description: '' }) }

  const typeColors = { Exam: 'badge-exam', Event: 'badge-event', Academic: 'badge-academic', Meeting: 'badge-meeting', Holiday: 'badge-event', Sports: 'badge-sports' }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <SectionIcon icon={Calendar} />
          <h3 className="font-display font-bold text-navy text-xl">{editing ? 'Edit Event' : 'Add Calendar Event'}</h3>
        </div>
        <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label-modern">Event Title *</label>
            <input className="input-modern" placeholder="e.g. Annual Sports Day" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          </div>
          <div>
            <label className="label-modern">Date</label>
            <input type="date" className="input-modern" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
          </div>
          <div>
            <label className="label-modern">Type</label>
            <select className="input-modern" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
              {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label-modern">Description (optional)</label>
            <textarea className="input-modern resize-none" rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="btn-gold flex-1"><Plus className="h-4 w-4" />{editing ? 'Update Event' : 'Add Event'}</button>
            {editing && <button type="button" onClick={cancel} className="px-6 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center gap-2"><X className="h-4 w-4" />Cancel</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <h3 className="font-display font-bold text-navy text-xl mb-5">All Events ({events.length})</h3>
        {loading ? <EmptyState message="Loading..." /> : events.length === 0 ? <EmptyState message="No events yet." /> : (
          <div className="space-y-3">
            {[...events].sort((a, b) => new Date(a.date) - new Date(b.date)).map(ev => (
              <div key={ev.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gold/30 hover:bg-gray-50 transition-all">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge ${typeColors[ev.type] || 'badge-academic'} text-[11px]`}>{ev.type}</span>
                  </div>
                  <p className="font-semibold text-navy text-sm truncate">{ev.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(ev.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-1 ml-3">
                  <button onClick={() => startEdit(ev)} className="p-2 text-navy hover:bg-gold/10 hover:text-gold rounded-lg transition-all"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => del(ev.id)} className="p-2 text-danger hover:bg-danger-light rounded-lg transition-all"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── STAFF TAB ─────────────────────────────────────────────────────────────────
function StaffTab({ toast }) {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ id: '', name: '', role: 'Teacher', subject: '', image_url: '', pin: '' })
  const [editing, setEditing] = useState(null)
  const [showEditor, setShowEditor] = useState(false)

  const fetchStaff = async () => {
    setLoading(true)
    let { data, error } = await supabase.from('school_staff').select('*').order('display_order', { ascending: true })
    if (error) {
      const fallback = await supabase.from('school_staff').select('*').order('name')
      data = fallback.data
    }
    if (data) setStaff(data)
    setLoading(false)
  }
  useEffect(() => { fetchStaff() }, [])

  // ── Drag and Drop Logic ───────────────────────────────────────────────────
  const [draggedIndex, setDraggedIndex] = useState(null)

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.target.style.opacity = '0.5'
  }

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1'
    setDraggedIndex(null)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
  }

  const handleDrop = async (e, targetIndex) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === targetIndex) return

    const newStaff = [...staff]
    const draggedItem = newStaff.splice(draggedIndex, 1)[0]
    newStaff.splice(targetIndex, 0, draggedItem)

    setStaff(newStaff)

    try {
      const updatePromises = newStaff.map((item, idx) => 
        supabase.from('school_staff').update({ display_order: idx }).eq('id', item.id)
      )
      const results = await Promise.all(updatePromises)
      
      const errors = results.filter(r => r.error)
      if (errors.length > 0) {
        toast({ type: 'error', text: `Failed: ${errors[0].error.message}` })
        fetchStaff()
      } else {
        toast({ type: 'success', text: 'Staff order updated!' })
      }
    } catch (err) {
      toast({ type: 'error', text: `Error: ${err.message}` })
      fetchStaff()
    }
  }

  const startEdit = (s) => { 
    setEditing(s)
    setForm({ id: s.id, name: s.name, role: s.role || 'Teacher', subject: s.subject || '', image_url: s.image_url || s.photo_url || '', pin: s.pin || '' })
    setShowEditor(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const startAdd = () => {
    setEditing(null)
    setForm({ id: '', name: '', role: 'Teacher', subject: '', image_url: '', pin: '' })
    setShowEditor(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const save = async (e) => {
    e.preventDefault()
    if (!form.name || !form.id) return toast({ type: 'error', text: 'Name and ID required' })
    if (editing) {
      const { id: _id, ...updatePayload } = form
      // Send only valid columns for school_staff
      const payload = { 
        ...updatePayload, 
        photo_url: form.image_url 
      }
      delete payload.image_url // Remove the temporary JS field before sending to DB
      const { data: updated, error } = await supabase.from('school_staff').update(payload).eq('id', editing.id).select()
      if (error) toast({ type: 'error', text: `Update failed: ${error.message}` })
      else if (!updated || updated.length === 0) toast({ type: 'error', text: 'Update blocked by database policy.' })
      else { toast({ type: 'success', text: 'Staff updated!' }); setShowEditor(false); fetchStaff() }
    } else {
      const payload = { 
        ...form, 
        photo_url: form.image_url 
      }
      delete payload.image_url
      const { error } = await supabase.from('school_staff').insert([payload])
      if (error) {
        if (error.code === '23505') toast({ type: 'error', text: 'This Staff ID already exists.' })
        else toast({ type: 'error', text: error.message })
      } else { toast({ type: 'success', text: 'Staff added!' }); setShowEditor(false); fetchStaff() }
    }
  }

  const del = async (id) => { if (confirm('Remove staff member?')) { await supabase.from('school_staff').delete().eq('id', id); toast({ type: 'success', text: 'Removed.' }); fetchStaff() } }

  if (loading && staff.length === 0) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <SectionIcon icon={GraduationCap} />
          <div>
            <h3 className="font-display font-bold text-navy text-xl">Staff Directory</h3>
            <p className="text-xs text-navy/60">Manage teachers and administration staff</p>
          </div>
        </div>
        {!showEditor && (
          <button onClick={startAdd} className="btn-gold px-6 py-3 flex items-center justify-center gap-2 shadow-lg shadow-gold/20">
            <Plus className="h-5 w-5" /> Add Staff
          </button>
        )}
      </div>

      {showEditor && (
        <div className="bg-white rounded-3xl border-2 border-gold/30 shadow-2xl overflow-hidden animate-fade-in relative">
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between mb-2">
               <h4 className="font-display font-bold text-navy text-lg">{editing ? 'Edit Profile' : 'New Staff Profile'}</h4>
               <button onClick={() => setShowEditor(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={save} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-4">
                <label className="block text-sm font-bold text-navy">Profile Photo</label>
                <FileUploader folder="profile" currentUrl={form.image_url} onUpload={url => setForm(p=>({...p, image_url: url}))} />
                <p className="text-[10px] text-gray-400 italic text-center">Images are automatically optimized for web use.</p>
              </div>
              <div className="lg:col-span-2 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="label-modern">Staff ID (Unique) *</label><input className="input-modern" placeholder="e.g. T-101" value={form.id} onChange={e=>setForm({...form, id: e.target.value})} disabled={!!editing} required /></div>
                  <div><label className="label-modern">Full Name *</label><input className="input-modern" placeholder="Enter name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="label-modern">Role/Position</label><input className="input-modern" placeholder="e.g. Senior Teacher" value={form.role} onChange={e=>setForm({...form, role: e.target.value})} /></div>
                  <div><label className="label-modern">Subject (if any)</label><input className="input-modern" placeholder="e.g. Mathematics" value={form.subject} onChange={e=>setForm({...form, subject: e.target.value})} /></div>
                </div>
                <div><label className="label-modern">Login PIN (4-digits) *</label><input className="input-modern" type="password" maxLength={4} value={form.pin} onChange={e=>setForm({...form, pin: e.target.value})} required /></div>
                <div className="flex gap-3 pt-4">
                   <button type="submit" className="btn-gold flex-1 py-4 text-base font-bold shadow-xl shadow-gold/20">Save Profile</button>
                   <button type="button" onClick={() => setShowEditor(false)} className="px-8 py-4 border-2 border-gray-100 rounded-2xl font-bold text-navy hover:bg-gray-50 transition-all">Cancel</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((s, idx) => (
          <div 
            key={s.id} 
            draggable
            onDragStart={(e) => handleDragStart(e, idx)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDrop={(e) => handleDrop(e, idx)}
            className={`bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-xl hover:border-gold/30 transition-all group animate-scale-in cursor-move ${draggedIndex === idx ? 'border-gold border-2 dashed scale-95 opacity-50' : ''}`}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="flex flex-col items-center gap-2 pt-2">
                 <div className="text-gray-300 group-hover:text-gold transition-colors">
                    <GripVertical className="h-4 w-4" />
                 </div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-navy/5 to-gold/10 overflow-hidden flex-shrink-0 border border-gray-100 shadow-inner">
                <img src={s.image_url ? `${s.image_url}?t=${Date.now()}` : (s.photo_url ? `${s.photo_url}?t=${Date.now()}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=f0f2f5&color=072f6e`)} className="w-full h-full object-cover" alt={s.name} onError={e => e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(s.name)} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-navy truncate leading-tight mb-0.5">{s.name}</h4>
                <p className="text-xs font-bold text-gold uppercase tracking-wider">{s.role}</p>
                {s.subject && <p className="text-[11px] text-gray-400 mt-1 line-clamp-1 italic">{s.subject}</p>}
                <p className="text-[10px] text-gray-300 mt-1 font-mono uppercase tracking-tighter">ID: {s.id}</p>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
              <button onClick={() => startEdit(s)} className="flex-1 py-2 text-xs font-bold text-navy bg-gray-50 hover:bg-gold/10 hover:text-gold rounded-xl border border-gray-100 transition-all flex items-center justify-center gap-2">
                <Edit className="h-3.5 w-3.5" /> Edit
              </button>
              <button onClick={() => del(s.id)} className="w-10 py-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl border border-red-100 transition-all flex items-center justify-center">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── SMC TAB ───────────────────────────────────────────────────────────────────
function SMCTab({ toast }) {
  const [smc, setSMC] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', position: 'Member', image_url: '' })
  const [editing, setEditing] = useState(null)
  const [showEditor, setShowEditor] = useState(false)

  const fetchSMC = async () => {
    setLoading(true)
    let { data, error } = await supabase.from('school_smc').select('*').order('display_order', { ascending: true })
    if (error) {
      const fallback = await supabase.from('school_smc').select('*').order('name')
      data = fallback.data
    }
    if (data) setSMC(data)
    setLoading(false)
  }
  useEffect(() => { fetchSMC() }, [])

  // ── Drag and Drop Logic ───────────────────────────────────────────────────
  const [draggedIndex, setDraggedIndex] = useState(null)

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    // Optional: add a ghost image/style
    e.target.style.opacity = '0.5'
  }

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1'
    setDraggedIndex(null)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (index === draggedIndex) return
  }

  const handleDrop = async (e, targetIndex) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === targetIndex) return

    const newSMC = [...smc]
    const draggedItem = newSMC.splice(draggedIndex, 1)[0]
    newSMC.splice(targetIndex, 0, draggedItem)

    // Update local state immediately for smooth UI
    setSMC(newSMC)

    try {
      const updatePromises = newSMC.map((item, idx) => 
        supabase.from('school_smc').update({ display_order: idx }).eq('id', item.id)
      )
      const results = await Promise.all(updatePromises)
      
      const errors = results.filter(r => r.error)
      if (errors.length > 0) {
        toast({ type: 'error', text: `Failed: ${errors[0].error.message}` })
        fetchSMC() // Revert
      } else {
        toast({ type: 'success', text: 'Order updated!' })
      }
    } catch (err) {
      toast({ type: 'error', text: `Error: ${err.message}` })
      fetchSMC()
    }
  }

  const startEdit = (m) => { 
    setEditing(m)
    setForm({ name: m.name, position: m.position, image_url: m.image_url || m.image || '' })
    setShowEditor(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const startAdd = () => {
    setEditing(null)
    setForm({ name: '', position: 'Member', image_url: '' })
    setShowEditor(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const save = async (e) => {
    e.preventDefault()
    if (!form.name) return toast({ type: 'error', text: 'Name is required' })
    const payload = { 
      ...form, 
      image: form.image_url
    }
    delete payload.image_url
    const { data: updated, error } = await supabase.from('school_smc').upsert(editing ? { ...payload, id: editing.id } : [payload]).select()
    if (error) toast({ type: 'error', text: `Error: ${error.message}` })
    else { toast({ type: 'success', text: editing ? 'Member updated!' : 'Member added!' }); setShowEditor(false); fetchSMC() }
  }

  const del = async (id) => { if (confirm('Remove committee member?')) { await supabase.from('school_smc').delete().eq('id', id); toast({ type: 'success', text: 'Removed.' }); fetchSMC() } }

  if (loading && smc.length === 0) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <SectionIcon icon={UsersIcon} />
          <div>
            <h3 className="font-display font-bold text-navy text-xl">Management Committee</h3>
            <p className="text-xs text-navy/60">School Management Committee (SMC) members</p>
          </div>
        </div>
        {!showEditor && (
          <button onClick={startAdd} className="btn-gold px-6 py-3 flex items-center justify-center gap-2 shadow-lg shadow-gold/20">
            <Plus className="h-5 w-5" /> Add Member
          </button>
        )}
      </div>

      {showEditor && (
        <div className="bg-white rounded-3xl border-2 border-gold/30 shadow-2xl overflow-hidden animate-fade-in relative">
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between mb-2">
               <h4 className="font-display font-bold text-navy text-lg">{editing ? 'Edit Member' : 'New Committee Member'}</h4>
               <button onClick={() => setShowEditor(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={save} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-4">
                <label className="block text-sm font-bold text-navy">Member Photo</label>
                <FileUploader folder="profile" currentUrl={form.image_url} onUpload={url => setForm(p=>({...p, image_url: url}))} />
              </div>
              <div className="lg:col-span-2 space-y-5">
                <div><label className="label-modern">Full Name *</label><input className="input-modern" placeholder="Enter name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required /></div>
                <div><label className="label-modern">Position *</label><input className="input-modern" placeholder="e.g. Chairperson" value={form.position} onChange={e=>setForm({...form, position: e.target.value})} required /></div>
                <div className="flex gap-3 pt-4">
                   <button type="submit" className="btn-gold flex-1 py-4 text-base font-bold shadow-xl shadow-gold/20">Save Member</button>
                   <button type="button" onClick={() => setShowEditor(false)} className="px-8 py-4 border-2 border-gray-100 rounded-2xl font-bold text-navy hover:bg-gray-50 transition-all">Cancel</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {smc.map((m, idx) => (
          <div 
            key={m.id} 
            draggable
            onDragStart={(e) => handleDragStart(e, idx)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDrop={(e) => handleDrop(e, idx)}
            className={`bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-xl hover:border-gold/30 transition-all group animate-scale-in cursor-move ${draggedIndex === idx ? 'border-gold border-2 dashed scale-95 opacity-50' : ''}`}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="flex flex-col items-center gap-2">
                 <div className="w-6 h-6 flex items-center justify-center text-gray-300 group-hover:text-gold transition-colors">
                    <GripVertical className="h-4 w-4" />
                 </div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/10 to-transparent overflow-hidden flex-shrink-0 border border-gold/10">
                <img src={m.image_url ? `${m.image_url}?t=${Date.now()}` : (m.image ? `${m.image}?t=${Date.now()}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=fdf8e6&color=b45309`)} className="w-full h-full object-cover" alt={m.name} onError={e => e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(m.name)} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-navy truncate leading-tight mb-1">{m.name}</h4>
                <p className="text-[11px] font-bold text-gold-dark uppercase tracking-widest">{m.position}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(m)} className="flex-1 py-2 text-xs font-bold text-navy bg-gray-50 hover:bg-gold/10 hover:text-gold rounded-xl border border-gray-100 transition-all flex items-center justify-center gap-2">
                <Edit className="h-4 w-4" /> Edit
              </button>
              <button onClick={() => del(m.id)} className="w-11 py-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl border border-red-100 transition-all flex items-center justify-center">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── GALLERY TAB ───────────────────────────────────────────────────────────────
function GalleryTab({ toast }) {
  const [galleries, setGalleries] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ album: '', image_url: '', caption: '', date: today() })
  const [editing, setEditing] = useState(null)
  const [albums, setAlbums] = useState([])
  const [newAlbum, setNewAlbum] = useState('')

  function today() { return new Date().toISOString().split('T')[0] }

  const fetchGallery = async () => {
    setLoading(true)
    const { data } = await supabase.from('school_gallery').select('*').order('date', { ascending: false })
    if (data) {
      setGalleries(data)
      const unique = [...new Set(data.map(g => g.album).filter(Boolean))]
      setAlbums(unique)
    }
    setLoading(false)
  }

  useEffect(() => { fetchGallery() }, [])

  const save = async (e) => {
    e.preventDefault()
    const payload = { 
      ...form, 
      image_url: form.image_url
    }
    const { error } = await supabase.from('school_gallery').upsert(editing ? { ...payload, id: editing.id } : [payload])
    
    if (error) {
      toast({ type: 'error', text: `Failed: ${error.message}` })
    } else {
      toast({ type: 'success', text: editing ? 'Updated!' : 'Image added to gallery!' })
      setEditing(null)
      setForm({ album: '', image_url: '', caption: '', date: today() })
      fetchGallery()
    }
  }

  const startEdit = (g) => { setEditing(g); setForm({ album: g.album || '', image_url: g.image_url, caption: g.caption || '', date: g.date }) }
  const del = async (id) => { 
    if (confirm('Delete this image?')) { 
      const { error } = await supabase.from('school_gallery').delete().eq('id', id)
      if (error) toast({ type: 'error', text: error.message })
      else { toast({ type: 'success', text: 'Deleted.' }); fetchGallery() } 
    } 
  }
  const cancel = () => { setEditing(null); setForm({ album: '', image_url: '', caption: '', date: today() }) }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <SectionIcon icon={Image} />
          <h3 className="font-display font-bold text-navy text-xl">{editing ? 'Edit Image' : 'Add Gallery Image'}</h3>
        </div>
        <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <FileUploader label="Gallery Image" folder="gallery" currentUrl={form.image_url} onUpload={(url) => setForm(p => ({ ...p, image_url: url }))} />
          </div>
          <div>
            <label className="label-modern">Album</label>
            <div className="flex gap-2">
              <select className="input-modern flex-1" value={form.album} onChange={e => setForm(p => ({ ...p, album: e.target.value }))}>
                <option value="">No Album</option>
                {albums.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div className="flex gap-2 mt-2">
              <input className="input-modern flex-1" placeholder="Or type new album name" value={newAlbum} onChange={e => setNewAlbum(e.target.value)} />
              <button type="button" onClick={() => { if (newAlbum.trim()) { setForm(p => ({ ...p, album: newAlbum.trim() })); setNewAlbum('') } }} className="px-3 py-2 bg-gold/10 text-gold rounded-xl border border-gold/30 text-sm font-medium hover:bg-gold/20 transition-all">Use</button>
            </div>
          </div>
          <div>
            <label className="label-modern">Date</label>
            <input type="date" className="input-modern" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <label className="label-modern">Caption (optional)</label>
            <input className="input-modern" placeholder="Describe the image..." value={form.caption} onChange={e => setForm(p => ({ ...p, caption: e.target.value }))} />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="btn-gold flex-1"><Plus className="h-4 w-4" />{editing ? 'Update Image' : 'Add to Gallery'}</button>
            {editing && <button type="button" onClick={cancel} className="px-6 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center gap-2"><X className="h-4 w-4" />Cancel</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <h3 className="font-display font-bold text-navy text-xl mb-5">Gallery ({galleries.length} images)</h3>
        {loading ? <EmptyState message="Loading..." /> : galleries.length === 0 ? <EmptyState message="No images yet." /> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {galleries.map(g => (
              <div key={g.id} className="group relative rounded-xl overflow-hidden border border-gray-100 aspect-square bg-gray-50">
                <img src={g.image_url} alt={g.caption || 'Gallery'} className="w-full h-full object-cover" onError={e => { e.target.src = ''; e.target.parentElement.classList.add('bg-gray-100') }} />
                <div className="absolute inset-0 bg-navy/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2 p-2">
                  {g.caption && <p className="text-white text-xs text-center leading-tight">{g.caption}</p>}
                  {g.album && <span className="badge badge-news text-[10px]">{g.album}</span>}
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => startEdit(g)} className="p-1.5 bg-white/20 hover:bg-gold/80 rounded-lg transition-all"><Edit className="h-3.5 w-3.5 text-white" /></button>
                    <button onClick={() => del(g.id)} className="p-1.5 bg-white/20 hover:bg-danger/80 rounded-lg transition-all"><Trash2 className="h-3.5 w-3.5 text-white" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── SETTINGS TAB ──────────────────────────────────────────────────────────────
function SettingsTab({ toast }) {
  const [settings, setSettings] = useLocalStorage('schoolSettings', {
    name: 'Shanti Varsha Angreji Ma. Vi.',
    address: 'Vyas-5, Chapaghat, Damauli, Tanahun',
    phone: '+977-XXXXXXXX',
    email: 'info@shantivarsha.edu.np',
    facebook: '#',
    instagram: '#',
    youtube: '#',
    established: '2065',
    principal_name: 'Sachin Shrestha',
    principal_message: 'Welcome to Shanti Varsha. We are committed to excellence in education.',
    principal_photo: '',
  })

  const save = async (e) => {
    e.preventDefault()
    setSettings({ ...settings })
    
    try {
      const { error } = await supabase.from('school_settings').upsert({ id: 1, ...settings })
      if (error) console.error("Supabase school_settings error:", error)
    } catch (err) {
      console.warn("Supabase school_settings table not found.")
    }

    toast({ type: 'success', text: 'Settings updated! Your profile and message are now live.' })
    window.dispatchEvent(new Event('schoolSettingsUpdated'))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* General Information Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        <div className="px-6 py-5 bg-navy text-white flex items-center gap-3">
          <SectionIcon icon={Settings} />
          <h3 className="font-display font-bold text-lg">General School Information</h3>
        </div>
        <form onSubmit={save} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              ['School Name', 'name', 'Shanti Varsha Angreji Ma. Vi.'],
              ['Address', 'address', 'Vyas-5, Chapaghat, Damauli'],
              ['Phone Number', 'phone', '+977-XXXXXXXX'],
              ['Email Address', 'email', 'info@shantivarsha.edu.np'],
              ['Established Year', 'established', '2065'],
              ['Facebook Link', 'facebook', 'https://facebook.com/...'],
            ].map(([label, field, placeholder]) => (
              <div key={field}>
                <label className="label-modern font-bold text-navy mb-2 block">{label}</label>
                <input className="input-modern bg-gray-50/50" placeholder={placeholder} value={settings[field] || ''} onChange={e => setSettings(p => ({ ...p, [field]: e.target.value }))} />
              </div>
            ))}
          </div>

          <div className="h-px bg-gray-100" />

          {/* Principal's Message Section */}
          <div className="space-y-6">
            <h4 className="font-bold text-navy flex items-center gap-2">
               <User className="h-5 w-5 text-gold" /> Principal's Profile & Message
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
               <div className="lg:col-span-1">
                 <label className="label-modern font-bold text-navy mb-3 block">Official Photo</label>
                 <FileUploader 
                   label="Principal Portrait" 
                   folder="settings" 
                   currentUrl={settings.principal_photo} 
                   onUpload={url => setSettings(p => ({ ...p, principal_photo: url }))} 
                 />
               </div>
               <div className="lg:col-span-2 space-y-5">
                 <div>
                   <label className="label-modern font-bold text-navy mb-2 block">Principal's Full Name</label>
                   <input className="input-modern" placeholder="Enter name" value={settings.principal_name || ''} onChange={e => setSettings(p => ({ ...p, principal_name: e.target.value }))} />
                 </div>
                 <div>
                   <label className="label-modern font-bold text-navy mb-2 block">Official Message to Parents/Students</label>
                   <textarea 
                     className="input-modern min-h-[160px] leading-relaxed resize-none" 
                     placeholder="Type official message here..." 
                     value={settings.principal_message || ''} 
                     onChange={e => setSettings(p => ({ ...p, principal_message: e.target.value }))} 
                   />
                 </div>
               </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <button type="submit" className="btn-gold w-full py-4 text-base font-bold shadow-xl shadow-gold/20 hover:scale-[1.01] transition-all">
              Save All Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── DASHBOARD TAB ─────────────────────────────────────────────────────────────
function DashboardTab({ setActiveTab }) {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
       try {
         const [ {count: smcCount}, {count: nCount}, {count: sCount}, {count: aCount} ] = await Promise.all([
            supabase.from('school_smc').select('*', { count: 'exact', head: true }),
            supabase.from('school_notices').select('*', { count: 'exact', head: true }),
            supabase.from('school_staff').select('*', { count: 'exact', head: true }),
            supabase.from('school_articles').select('*', { count: 'exact', head: true })
         ])
         setStats([
            { label: 'SMC Members', value: smcCount || 0, icon: UsersIcon, color: 'from-blue-500 to-indigo-600' },
            { label: 'Published Notices', value: nCount || 0, icon: Bell, color: 'from-amber-400 to-orange-600' },
            { label: 'Staff Directory', value: sCount || 0, icon: GraduationCap, color: 'from-emerald-500 to-teal-600' },
            { label: 'School Articles', value: aCount || 0, icon: FileText, color: 'from-purple-500 to-pink-600' }
         ])
       } catch (err) {
         console.error("Dashboard Stats Error:", err)
       } finally {
         setLoading(false)
       }
    }
    fetchStats()
  }, [])

  const quickActions = [
    { label: 'Manage SMC', icon: UsersIcon, tab: 'smc', color: 'bg-blue-500' },
    { label: 'Post Notice', icon: Bell, tab: 'notices', color: 'bg-amber-500' },
    { label: 'Manage Staff', icon: GraduationCap, tab: 'staff', color: 'bg-emerald-500' },
    { label: 'School Info', icon: Settings, tab: 'settings', color: 'bg-purple-500' },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-navy to-navy-dark rounded-2xl p-5 sm:p-6 text-white shadow-lg flex flex-col justify-center">
         <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold">Welcome Back, Admin</h2>
              <p className="text-blue-100/80 text-sm mt-1">Here's a snapshot of the school's current metrics today.</p>
            </div>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? Array(4).fill(0).map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse"></div>
        )) : stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden flex items-center justify-between">
            <div>
              <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{label}</div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-navy leading-none">{value}</div>
            </div>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-display font-bold text-navy flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gold" />
            Quick Management
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
             {quickActions.map((action) => (
               <button 
                 key={action.label} 
                 onClick={() => setActiveTab(action.tab)}
                 className="flex flex-col items-center justify-center gap-3 p-4 sm:p-6 bg-white border border-gray-100 rounded-3xl hover:border-gold/30 hover:shadow-premium group transition-all duration-300"
               >
                 <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${action.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                 </div>
                 <span className="text-xs sm:text-sm font-bold text-navy text-center">{action.label}</span>
               </button>
             ))}
          </div>
        </div>
      </div>
    </div>
  )
}
// ── TOPPERS TAB ──────────────────────────────────────────────────────────────
function ToppersTab({ toast }) {
  const [toppers, setToppers] = useState([])
  const [form, setForm] = useState({ name: '', batch: '', score: '', badge: '', note: '', photo_url: '' })
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)

  const fetchToppers = async () => {
    setLoading(true)
    let { data, error } = await supabase.from('school_toppers').select('*').order('display_order', { ascending: true })
    if (error) {
      const fallback = await supabase.from('school_toppers').select('*').order('batch', { ascending: false })
      data = fallback.data
    }
    if (data) setToppers(data)
    setLoading(false)
  }
  useEffect(() => { fetchToppers() }, [])

  // ── Drag and Drop Logic ───────────────────────────────────────────────────
  const [draggedIndex, setDraggedIndex] = useState(null)

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.target.style.opacity = '0.5'
  }

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1'
    setDraggedIndex(null)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
  }

  const handleDrop = async (e, targetIndex) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === targetIndex) return

    const newToppers = [...toppers]
    const draggedItem = newToppers.splice(draggedIndex, 1)[0]
    newToppers.splice(targetIndex, 0, draggedItem)

    setToppers(newToppers)

    try {
      const updatePromises = newToppers.map((item, idx) => 
        supabase.from('school_toppers').update({ display_order: idx }).eq('id', item.id)
      )
      const results = await Promise.all(updatePromises)
      
      const errors = results.filter(r => r.error)
      if (errors.length > 0) {
        toast({ type: 'error', text: `Failed: ${errors[0].error.message}` })
        fetchToppers()
      } else {
        toast({ type: 'success', text: 'Toppers order updated!' })
      }
    } catch (err) {
      toast({ type: 'error', text: `Error: ${err.message}` })
      fetchToppers()
    }
  }

  const startEdit = (t) => { 
    setEditing(t)
    setForm(t)
    setShowEditor(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const startAdd = () => {
    setEditing(null)
    setForm({ name: '', batch: '', score: '', badge: '', note: '', photo_url: '' })
    setShowEditor(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const save = async (e) => {
    e.preventDefault()
    if (editing) {
      const payload = { 
        ...form,
        photo_url: form.photo_url || form.image_url
      }; 
      delete payload.image_url
      delete payload.id
      const { error } = await supabase.from('school_toppers').update(payload).eq('id', editing.id)
      if (error) toast({ type: 'error', text: error.message })
      else { toast({ type: 'success', text: 'Topper updated!' }); setShowEditor(false); fetchToppers() }
    } else {
      const payload = { 
        ...form,
        photo_url: form.photo_url || form.image_url
      };
      delete payload.image_url
      const { error } = await supabase.from('school_toppers').insert([payload])
      if (error) toast({ type: 'error', text: error.message })
      else { toast({ type: 'success', text: 'Topper added!' }); setShowEditor(false); fetchToppers() }
    }
  }

  const del = async (id) => { if (confirm('Remove topper?')) { await supabase.from('school_toppers').delete().eq('id', id); toast({ type: 'success', text: 'Removed.' }); fetchToppers() } }

  if (loading && toppers.length === 0) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <SectionIcon icon={Award} />
          <div>
            <h3 className="font-display font-bold text-navy text-xl">Academic Toppers</h3>
            <p className="text-xs text-navy/60">High achievers and academic excellence</p>
          </div>
        </div>
        {!showEditor && (
          <button onClick={startAdd} className="btn-gold px-6 py-3 flex items-center justify-center gap-2 shadow-lg shadow-gold/20">
            <Plus className="h-5 w-5" /> Add Topper
          </button>
        )}
      </div>

      {showEditor && (
        <div className="bg-white rounded-3xl border-2 border-gold/30 shadow-2xl overflow-hidden animate-fade-in relative">
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between mb-2">
               <h4 className="font-display font-bold text-navy text-lg">{editing ? 'Edit Topper Details' : 'New Academic Topper'}</h4>
               <button onClick={() => setShowEditor(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={save} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-4">
                <label className="block text-sm font-bold text-navy">Student Photo</label>
                <FileUploader folder="toppers" currentUrl={form.photo_url} onUpload={url => setForm(p=>({...p, photo_url: url}))} />
              </div>
              <div className="lg:col-span-2 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="label-modern">Full Name *</label><input className="input-modern" placeholder="Enter student name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required /></div>
                  <div><label className="label-modern">Batch (Year) *</label><input className="input-modern" placeholder="e.g. 2080" value={form.batch} onChange={e=>setForm({...form, batch: e.target.value})} required /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="label-modern">Score/Result *</label><input className="input-modern" placeholder="e.g. 4.0 GPA / 95%" value={form.score} onChange={e=>setForm({...form, score: e.target.value})} required /></div>
                  <div><label className="label-modern">Badge/Position</label><input className="input-modern" placeholder="e.g. District Topper" value={form.badge} onChange={e=>setForm({...form, badge: e.target.value})} /></div>
                </div>
                <div><label className="label-modern">Note/Highlight</label><textarea className="input-modern min-h-[100px]" placeholder="e.g. Outstanding performance in Science..." value={form.note} onChange={e=>setForm({...form, note: e.target.value})} /></div>
                <div className="flex gap-3 pt-4">
                   <button type="submit" className="btn-gold flex-1 py-4 text-base font-bold shadow-xl shadow-gold/20">Save Achievement</button>
                   <button type="button" onClick={() => setShowEditor(false)} className="px-8 py-4 border-2 border-gray-100 rounded-2xl font-bold text-navy hover:bg-gray-50 transition-all">Cancel</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {toppers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 italic text-gray-400">
           No toppers listed. Start by adding a new record.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {toppers.map((t, idx) => (
            <div 
              key={t.id} 
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              className={`bg-white rounded-3xl border border-gray-100 p-5 hover:shadow-2xl hover:border-gold/30 transition-all group animate-scale-in flex flex-col justify-between cursor-move ${draggedIndex === idx ? 'border-gold border-2 dashed scale-95 opacity-50' : ''}`}
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex flex-col items-center gap-2">
                     <div className="text-gray-300 group-hover:text-gold transition-colors">
                        <GripVertical className="h-4 w-4" />
                     </div>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-50 to-gold/20 overflow-hidden flex-shrink-0 border border-gold/10 shadow-inner">
                    <img 
                      src={t.photo_url ? `${t.photo_url}?t=${Date.now()}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=fffbea&color=b45309`} 
                      className="w-full h-full object-cover" 
                      alt={t.name}
                      onError={e => e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(t.name)}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-navy truncate leading-tight mb-0.5">{t.name}</h4>
                    <p className="text-xs font-bold text-gold-dark uppercase tracking-widest">{t.batch} Batch</p>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-[10px] font-bold bg-navy text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">{t.score}</span>
                       {t.badge && <span className="text-[10px] font-bold bg-gold/10 text-gold-dark px-2 py-0.5 rounded-full border border-gold/20">{t.badge}</span>}
                    </div>
                  </div>
                </div>
                {t.note && <p className="text-xs text-gray-500 line-clamp-2 italic mb-4">"{t.note}"</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(t)} className="flex-1 py-2.5 text-xs font-bold text-navy bg-gray-50 hover:bg-gold/10 hover:text-gold rounded-xl border border-gray-100 transition-all flex items-center justify-center gap-2">
                  <Edit className="h-3.5 w-3.5" /> Edit
                </button>
                <button onClick={() => del(t.id)} className="w-11 py-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl border border-red-100 transition-all flex items-center justify-center">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── POPUPS TAB (MULTI) ────────────────────────────────────────────────────────
function PopupsTab({ toast }) {
  const [popups, setPopups] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ image_url: '', link_url: '', is_active: true, display_order: 0 })
  const [editing, setEditing] = useState(null)
  const [showEditor, setShowEditor] = useState(false)

  const fetchPopups = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('school_popups').select('*').order('display_order', { ascending: true })
    if (data) setPopups(data)
    setLoading(false)
  }

  useEffect(() => { fetchPopups() }, [])

  const save = async (e) => {
    e.preventDefault()
    if (!form.image_url) return toast({ type: 'error', text: 'Image is required' })
    
    const { error } = await supabase.from('school_popups').upsert(editing ? { ...form, id: editing.id } : [form])
    
    if (error) {
      toast({ type: 'error', text: `Failed: ${error.message}. Ensure table exists.` })
    } else {
      toast({ type: 'success', text: editing ? 'Popup updated!' : 'New popup added!' })
      setShowEditor(false)
      setEditing(null)
      setForm({ image_url: '', link_url: '', is_active: true, display_order: 0 })
      fetchPopups()
      window.dispatchEvent(new Event('schoolPopupsUpdated'))
    }
  }

  const startEdit = (p) => { setEditing(p); setForm(p); setShowEditor(true); window.scrollTo(0,0) }
  const startAdd = () => { setEditing(null); setForm({ image_url: '', link_url: '', is_active: true, display_order: 0 }); setShowEditor(true); window.scrollTo(0,0) }
  const del = async (id) => { if (confirm('Delete this popup?')) { await supabase.from('school_popups').delete().eq('id', id); toast({ type: 'success', text: 'Deleted.' }); fetchPopups() } }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <SectionIcon icon={Bell} />
          <div>
            <h3 className="font-display font-bold text-navy text-xl">Popup Sequence</h3>
            <p className="text-xs text-navy/60">Managed ads that appear sequentially to visitors</p>
          </div>
        </div>
        {!showEditor && (
          <button onClick={startAdd} className="btn-gold px-6 py-3 flex items-center justify-center gap-2 shadow-lg shadow-gold/20">
            <Plus className="h-5 w-5" /> New Popup
          </button>
        )}
      </div>

      {showEditor && (
        <div className="bg-white rounded-3xl border-2 border-gold/30 shadow-2xl overflow-hidden mb-8">
          <form onSubmit={save} className="p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold text-navy text-lg">{editing ? 'Edit Popup' : 'Add New Sequence Item'}</h4>
              <button type="button" onClick={() => setShowEditor(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400"><X className="h-5 w-5" /></button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-1">
                 <label className="label-modern">Popup Banner Image *</label>
                 <FileUploader folder="popups" currentUrl={form.image_url} onUpload={url => setForm(p=>({...p, image_url: url}))} />
               </div>
               <div className="lg:col-span-2 space-y-5">
                 <div><label className="label-modern">Action Link (Optional)</label><input className="input-modern" placeholder="e.g. /notices or https://..." value={form.link_url} onChange={e=>setForm({...form, link_url: e.target.value})} /></div>
                 <div className="grid grid-cols-2 gap-4">
                    <div><label className="label-modern">Display Order</label><input type="number" className="input-modern" value={form.display_order} onChange={e=>setForm({...form, display_order: parseInt(e.target.value)})} /></div>
                    <div className="flex items-center gap-3 pt-8">
                       <input type="checkbox" id="popup-active" checked={form.is_active} onChange={e=>setForm({...form, is_active: e.target.checked})} className="w-4 h-4 accent-gold" />
                       <label htmlFor="popup-active" className="text-sm font-bold text-navy cursor-pointer">Published & Active</label>
                    </div>
                 </div>
                 <div className="flex gap-3 pt-6">
                    <button type="submit" className="flex-1 btn-gold py-4 font-bold shadow-xl shadow-gold/20">Save Popup</button>
                    <button type="button" onClick={() => setShowEditor(false)} className="px-8 py-4 border-2 border-gray-100 rounded-2xl font-bold text-navy hover:bg-gray-50 transition-all">Cancel</button>
                 </div>
               </div>
            </div>
          </form>
        </div>
      )}

      {loading ? <EmptyState message="Loading popups..." /> : popups.length === 0 ? <EmptyState message="No popups in sequence. Start by adding a new one!" /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popups.map(p => (
            <div key={p.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
              <div className="relative aspect-[4/5] bg-slate-50">
                 <img src={p.image_url} alt="Popup" className="w-full h-full object-cover" />
                 {!p.is_active && <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center font-black text-gray-500 uppercase tracking-widest text-xs">Inactive</div>}
                 <div className="absolute top-3 left-3 bg-navy/80 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-lg">ORDER: {p.display_order}</div>
              </div>
              <div className="p-4 flex gap-2">
                 <button onClick={() => startEdit(p)} className="flex-1 py-2.5 text-xs font-bold bg-gray-50 border border-gray-100 text-navy hover:bg-gold/10 hover:text-gold rounded-xl transition-all flex items-center justify-center gap-2"><Edit className="h-3.5 w-3.5" /> Edit</button>
                 <button onClick={() => del(p.id)} className="w-11 py-2.5 text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl transition-all flex items-center justify-center"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Admin() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [toast, setToast] = useState({ type: '', text: '' })

  useEffect(() => {
    if (toast.text) {
      const t = setTimeout(() => setToast({ type: '', text: '' }), 3500)
      return () => clearTimeout(t)
    }
  }, [toast])

  const showToast = (msg) => setToast(msg)

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('username')
    localStorage.removeItem('userRole')
    localStorage.removeItem('adminLoggedIn')
    localStorage.removeItem('adminUsername')
    localStorage.removeItem('loginTimestamp')
    window.dispatchEvent(new Event('storage')) // Force Navbar state sync globally
    navigate('/login')
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Layout },
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'articles', label: 'Articles', icon: FileText },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'toppers', label: 'Toppers', icon: Award },
    { id: 'staff', label: 'Teachers', icon: GraduationCap },
    { id: 'smc', label: 'SMC', icon: UsersIcon },
    { id: 'testimonials', label: 'Messages', icon: Quote },
    {id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'curriculum', label: 'Curriculum', icon: Library },
    { id: 'popup', label: 'Ad Popup', icon: Bell },
    { id: 'settings', label: 'School Info', icon: Settings },
  ]

  const currentTab = tabs.find(t => t.id === activeTab)

  return (
    <div className="h-[100dvh] w-full bg-slate-50 flex flex-col lg:flex-row overflow-hidden">
      <Toast msg={toast} />

      {/* Sidebar - Desktop Only */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-navy h-full sticky top-0 shadow-xl z-40">
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-lg">
              <img src="/logos/SVS logo.png" alt="SVS Logo" className="h-8 w-8 object-contain" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-display font-bold text-sm truncate">SVS Admin</p>
              <p className="text-gold/70 text-[10px] uppercase tracking-wider font-semibold">Management</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-hide">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`admin-sidebar-link ${activeTab === id ? 'active' : ''}`}>
              <Icon className="h-5 w-5 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <button onClick={handleLogout} className="admin-sidebar-link text-red-400 hover:bg-red-500/20 hover:text-red-300 w-full">
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-[70] px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowMobileSidebar(true)} className="p-1 -ml-1 text-navy hover:bg-gray-100 rounded-lg">
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-navy p-1 rounded-md hidden sm:block">
              <img src="/logos/SVS logo.png" alt="Logo" className="h-4 w-4 object-contain" />
            </div>
            <h1 className="font-display font-bold text-navy text-lg truncate">{currentTab?.label || 'Admin'}</h1>
          </div>
        </div>
        <button onClick={handleLogout} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div className="lg:hidden fixed inset-0 z-[100] flex animate-fade-in">
          <div className="absolute inset-0 bg-navy/80 backdrop-blur-sm" onClick={() => setShowMobileSidebar(false)} />
          <div className="relative w-72 bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-navy p-1.5 rounded-lg">
                  <img src="/logos/SVS logo.png" alt="Logo" className="h-6 w-6 object-contain" />
                </div>
                <p className="text-navy font-display font-bold text-lg">Menu</p>
              </div>
              <button onClick={() => setShowMobileSidebar(false)} className="p-2 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
              <p className="px-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Modules</p>
              {tabs.map(({ id, label, icon: Icon }) => (
                <button 
                  key={id} 
                  onClick={() => { setActiveTab(id); setShowMobileSidebar(false); }} 
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === id ? 'bg-gold text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-navy'}`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden relative z-0">
        {/* Desktop Header */}
        <header className="hidden lg:flex bg-white border-b border-gray-200 sticky top-0 z-[70] px-8 py-4 items-center justify-between shadow-md backdrop-blur-md bg-white/95">
           <div className="flex items-center gap-3">
              {currentTab && <currentTab.icon className="h-5 w-5 text-gold" />}
              <h1 className="font-display font-bold text-navy text-xl">{currentTab?.label || 'Admin Portal'}</h1>
           </div>
           <div className="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
             Welcome, Administrator
           </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 lg:pb-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {activeTab === 'dashboard' && <DashboardTab setActiveTab={setActiveTab} />}
            {activeTab === 'notices' && <NoticesTab toast={showToast} />}
            {activeTab === 'news' && <NewsTab toast={showToast} />}
            {activeTab === 'articles' && <ArticlesTab toast={showToast} />}
            {activeTab === 'calendar' && <CalendarTab toast={showToast} />}
            {activeTab === 'toppers' && <ToppersTab toast={showToast} />}
            {activeTab === 'staff' && <StaffTab toast={showToast} />}
            {activeTab === 'smc' && <SMCTab toast={showToast} />}
            {activeTab === 'testimonials' && <TestimonialsTab toast={showToast} />}
            {activeTab === 'gallery' && <GalleryTab toast={showToast} />}
            {activeTab === 'curriculum' && <CurriculumTab toast={showToast} />}
            {activeTab === 'popup' && <PopupsTab toast={showToast} />}
            {activeTab === 'settings' && <SettingsTab toast={showToast} />}
          </div>
        </main>
      </div>
    </div>
  )
}

function CurriculumTab({ toast }) {
  const [curriculums, setCurriculums] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [showEditor, setShowEditor] = useState(false)
  const [form, setForm] = useState({ grade: 'Grade 10', subject: 'English', title: "Teacher's Guide", url: '', type: 'Document' })

  const grades = ['Nursery', 'LKG', 'UKG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10']
  const subjects = ['General', 'Nepali', 'English', 'Mathematics', 'Science', 'Social', 'Moral', 'Computer', 'Creative']

  const fetchCurriculum = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from('school_curriculum').select('*').order('grade').order('subject')
      if (error) throw error
      if (data) setCurriculums(data)
    } catch (err) {
      console.warn('Curriculum table might be missing:', err.message)
      setCurriculums([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCurriculum() }, [])

  const startAdd = () => {
    setEditing(null)
    setForm({ grade: 'Grade 10', subject: 'English', title: "Teacher's Guide", url: '', type: 'Document' })
    setShowEditor(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const startEdit = (c) => {
    setEditing(c)
    setForm(c)
    setShowEditor(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const save = async (e) => {
    e.preventDefault()
    if (!form.url || !form.title) return toast({ type: 'error', text: 'Title and URL are required' })
    
    if (editing) {
      const { error } = await supabase.from('school_curriculum').update(form).eq('id', editing.id)
      if (error) toast({ type: 'error', text: error.message })
      else { toast({ type: 'success', text: 'Updated!' }); setShowEditor(false); fetchCurriculum() }
    } else {
      const { error } = await supabase.from('school_curriculum').insert([form])
      if (error) toast({ type: 'error', text: error.message })
      else { toast({ type: 'success', text: 'Added!' }); setShowEditor(false); fetchCurriculum() }
    }
  }

  const del = async (id) => {
    if (confirm('Delete this link?')) {
      await supabase.from('school_curriculum').delete().eq('id', id)
      toast({ type: 'success', text: 'Deleted' })
      fetchCurriculum()
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <SectionIcon icon={Library} />
          <div>
            <h3 className="font-display font-bold text-navy text-xl">Curriculum & Files</h3>
            <p className="text-xs text-navy/60">Manage guides and syllabus for teachers</p>
          </div>
        </div>
        {!showEditor && (
          <button onClick={startAdd} className="btn-gold px-6 py-3 flex items-center justify-center gap-2 shadow-lg shadow-gold/20">
            <Plus className="h-5 w-5" /> Add Link
          </button>
        )}
      </div>

      {showEditor && (
        <div className="bg-white rounded-3xl border-2 border-gold/30 shadow-2xl overflow-hidden animate-fade-in relative z-50">
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between mb-2">
               <h4 className="font-display font-bold text-navy text-lg">{editing ? 'Edit Link' : 'New Curriculum Link'}</h4>
               <button onClick={() => setShowEditor(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="label-modern">Grade *</label>
                <select className="input-modern" value={form.grade} onChange={e=>setForm({...form, grade: e.target.value})}>
                  {grades.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="label-modern">Subject *</label>
                <select className="input-modern" value={form.subject} onChange={e=>setForm({...form, subject: e.target.value})}>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label-modern">Resource Type *</label>
                <select className="input-modern" value={form.type} onChange={e=>setForm({...form, type: e.target.value})}>
                  <option value="Document">Official Curriculum</option>
                  <option value="Archive">Lesson Syllabus</option>
                  <option value="PDF Guide">Teaching Manual</option>
                  <option value="Resources">Reference Material</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="label-modern">Title *</label>
                <input className="input-modern" placeholder="e.g. Teacher's Guide Class 4" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} required />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <label className="label-modern">URL (CDC Link or File Link) *</label>
                <input className="input-modern" placeholder="https://moecdc.gov.np/..." value={form.url} onChange={e=>setForm({...form, url: e.target.value})} required />
              </div>
              <div className="md:col-span-2 lg:col-span-3 flex gap-4 pt-4">
                 <button type="submit" className="btn-gold flex-1 py-4 text-base font-bold shadow-xl shadow-gold/20">Save Resource</button>
                 <button type="button" onClick={() => setShowEditor(false)} className="px-8 py-4 border-2 border-gray-100 rounded-2xl font-bold text-navy hover:bg-gray-50 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Grade / Subject</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Title</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Type</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {curriculums.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center">
                  <div className="max-w-md mx-auto space-y-3">
                    <AlertCircle className="h-10 w-10 text-gold/40 mx-auto" />
                    <p className="text-gray-500 font-medium tracking-tight">Curriculum data table not found or empty.</p>
                    <div className="p-4 bg-slate-50 rounded-xl border border-gray-100 text-[10px] font-mono text-left text-gray-400 overflow-x-auto whitespace-pre">
                      {`-- Run this in Supabase SQL Editor:
CREATE TABLE school_curriculum (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  grade TEXT,
  subject TEXT,
  title TEXT,
  url TEXT,
  type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`}
                    </div>
                  </div>
                </td>
              </tr>
            ) : curriculums.map(c => (
              <tr key={c.id} className="hover:bg-slate-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-navy uppercase tracking-widest">{c.grade}</span>
                    <span className="text-[10px] text-gold font-bold uppercase">{c.subject}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-navy line-clamp-1">{c.title}</span>
                    <a href={c.url} target="_blank" rel="noreferrer" className="p-1 text-gray-300 hover:text-gold transition-colors"><Maximize2 className="h-3 w-3" /></a>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-navy/5 text-navy text-[10px] font-bold rounded-lg border border-navy/10">{c.type}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(c)} className="p-2 text-gray-400 hover:text-navy hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-100"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => del(c.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all border border-transparent hover:border-red-100"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestimonialsTab({ toast }) {
  const [testimonials, setTestimonials] = useLocalStorage('schoolTestimonials', [])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', role: '', message: '' })
  const [showEditor, setShowEditor] = useState(false)

  const startAdd = () => {
    setEditing(null)
    setForm({ name: '', role: '', message: '' })
    setShowEditor(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const startEdit = (t) => {
    setEditing(t)
    setForm(t)
    setShowEditor(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const save = (e) => {
    e.preventDefault()
    if (!form.name || !form.message) return toast({ type: 'error', text: 'Name and message are required.' })
    if (editing) {
      setTestimonials(testimonials.map(t => t.id === editing.id ? { ...form, id: editing.id } : t))
      toast({ type: 'success', text: 'Message updated!' })
    } else {
      setTestimonials([...testimonials, { ...form, id: Date.now() }])
      toast({ type: 'success', text: 'Message added!' })
    }
    setShowEditor(false)
  }

  const del = (id) => {
    if (confirm('Delete this message?')) {
      setTestimonials(testimonials.filter(t => t.id !== id))
      toast({ type: 'success', text: 'Deleted.' })
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <SectionIcon icon={Quote} />
          <div>
            <h3 className="font-display font-bold text-navy text-xl">Stakeholders & Parents</h3>
            <p className="text-xs text-navy/60">Community feedback and testimonials</p>
          </div>
        </div>
        {!showEditor && (
          <button onClick={startAdd} className="btn-gold px-6 py-3 flex items-center justify-center gap-2 shadow-lg shadow-gold/20">
            <Plus className="h-5 w-5" /> Add Message
          </button>
        )}
      </div>

      {showEditor && (
        <div className="bg-white rounded-3xl border-2 border-gold/30 shadow-2xl overflow-hidden animate-fade-in relative z-50">
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between mb-2">
               <h4 className="font-display font-bold text-navy text-lg">{editing ? 'Edit Message' : 'New Message'}</h4>
               <button onClick={() => setShowEditor(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="label-modern">Full Name *</label><input className="input-modern" placeholder="Enter name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required /></div>
              <div><label className="label-modern">Role / Relation *</label><input className="input-modern" placeholder="e.g. Parent of Grade 10" value={form.role} onChange={e=>setForm({...form, role: e.target.value})} required /></div>
              <div className="md:col-span-2"><label className="label-modern">Message *</label><textarea className="input-modern min-h-[140px]" placeholder="Write message..." value={form.message} onChange={e=>setForm({...form, message: e.target.value})} required /></div>
              <div className="md:col-span-2 flex gap-3 pt-4">
                 <button type="submit" className="btn-gold flex-1 py-4 text-base font-bold shadow-xl shadow-gold/20">Save Message</button>
                 <button type="button" onClick={() => setShowEditor(false)} className="px-8 py-4 border-2 border-gray-100 rounded-2xl font-bold text-navy hover:bg-gray-50 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.length === 0 ? (
           <div className="col-span-full border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center">
             <div className="inline-flex p-4 bg-gray-50 rounded-full mb-4">
                <Quote className="h-8 w-8 text-gray-400" />
             </div>
             <p className="text-gray-500 font-medium">No messages yet. Add one to display on the About page.</p>
           </div>
        ) : testimonials.map(m => (
          <div key={m.id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)] hover:border-gold/30 transition-all duration-300 relative group flex flex-col justify-between h-full group">
            <Quote className="h-10 w-10 text-gold/10 absolute right-6 top-6 transition-transform group-hover:scale-110 group-hover:text-gold/20 duration-500" />
            <div className="mb-6 relative z-10">
              <p className="text-sm font-medium text-gray-700 italic leading-relaxed whitespace-pre-wrap">"{m.message}"</p>
            </div>
            
            <div className="flex flex-col gap-4 relative z-10">
              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-display font-bold text-navy truncate">{m.name}</h4>
                <p className="text-[10px] font-extrabold text-gold-dark uppercase tracking-widest">{m.role}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(m)} className="flex-1 py-2 text-xs font-bold text-navy bg-white hover:bg-navy hover:text-white rounded-xl border border-gray-200 hover:border-navy transition-all flex items-center justify-center gap-2">
                  <Edit className="h-3.5 w-3.5" /> Edit
                </button>
                <button onClick={() => del(m.id)} className="w-12 py-2 text-red-500 bg-white hover:bg-red-50 rounded-xl border border-gray-200 transition-all flex items-center justify-center hover:border-red-500/20 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Admin
