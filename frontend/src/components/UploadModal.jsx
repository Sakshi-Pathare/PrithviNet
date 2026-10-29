import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  MapPin, 
  Camera, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import { createEcoPost } from '../api';

const SAMPLE_LOCATIONS = [
  { name: 'MITAOE Campus, Alandi', lat: 18.6756, lng: 73.8967 },
  { name: 'Koregaon Park Joggers Park, Pune', lat: 18.5362, lng: 73.8958 },
  { name: 'Alandi Indrayani Riverbank, Pune', lat: 18.6740, lng: 73.8990 },
  { name: 'Baner Bio-Park Area, Pune', lat: 18.5590, lng: 73.7868 },
  { name: 'Viman Nagar Green Society, Pune', lat: 18.5679, lng: 73.9143 }
];

export default function UploadModal({ isOpen, onClose, onPostCreated, user, onToast }) {
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [category, setCategory] = useState('Clean-up Drive');
  const [coords, setCoords] = useState({ lat: 18.5204, lng: 73.8567 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMessage('');
    }
  };

  const handleUseDemoPhoto = () => {
    setPreviewUrl('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop');
    setSelectedFile(null);
    setErrorMessage('');
  };

  const handleSelectPresetLocation = (preset) => {
    setLocationName(preset.name);
    setCoords({ lat: preset.lat, lng: preset.lng });
  };

  const handleNextStep = () => {
    if (!previewUrl) {
      setErrorMessage('Please attach or select a photo of your green action to proceed.');
      return;
    }
    setErrorMessage('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!description.trim()) {
      setErrorMessage('Please add a 1-sentence description of what you did.');
      return;
    }

    if (!locationName.trim()) {
      setErrorMessage('Please enter the neighborhood or campus location name.');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('description', description);
      formData.append('location_name', locationName);
      formData.append('category', category);
      formData.append('lat', coords.lat);
      formData.append('lng', coords.lng);
      formData.append('user_id', user?.id || 1);

      if (selectedFile) {
        formData.append('file', selectedFile);
      } else {
        formData.append('photo_url', previewUrl);
      }

      const newPost = await createEcoPost(formData);

      onToast?.({
        type: 'success',
        title: 'Action Verified & Posted! 🌱',
        message: `Photo Check passed! You earned +${newPost.points_awarded} Green Points.`
      });

      onPostCreated?.(newPost);
      // Reset
      setStep(1);
      setPreviewUrl('');
      setSelectedFile(null);
      setDescription('');
      setLocationName('');
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Could not verify post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-[#E2DDD1] shadow-xl p-6 sm:p-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2DDD1]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#E8EFEA] border border-[#7C9D8E]/30 flex items-center justify-center text-[#587B6C]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-[#2C4A3E]">
                Share Real-Action Proof
              </h2>
              <p className="text-xs text-[#8C857B] font-medium">
                Step {step} of 2 // Photo Check
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F5F2EB] hover:bg-[#EAE5D9] flex items-center justify-center text-[#8C857B] hover:text-[#2C4A3E] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: CHOOSE PHOTO PROOF */}
        {step === 1 && (
          <div className="mt-6 space-y-4">
            <label className="block text-xs font-semibold text-[#2C4A3E] uppercase">
              1. Attach Photo Proof of Your Green Action
            </label>

            <div className="relative rounded-2xl border-2 border-dashed border-[#E2DDD1] hover:border-[#7C9D8E] transition-all bg-[#FAF8F5] overflow-hidden cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
              />

              {previewUrl ? (
                <div className="relative h-56 w-full">
                  <img 
                    src={previewUrl} 
                    alt="Proof Preview" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-2 right-2 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#7C9D8E] text-xs font-semibold text-[#2C4A3E] flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#587B6C]" />
                    <span>Photo Selected</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#E8EFEA] border border-[#7C9D8E]/30 flex items-center justify-center text-[#587B6C] mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-sm text-[#2C4A3E]">
                    Click to browse or drag & drop photo
                  </p>
                  <p className="text-xs text-[#8C857B] mt-1">
                    Snap your tree planting, clean-up bags, or composting bin
                  </p>
                </div>
              )}
            </div>

            {/* Demo Photo Option */}
            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={handleUseDemoPhoto}
                className="text-[#587B6C] hover:underline font-semibold"
              >
                Use sample tree-planting photo
              </button>
              {previewUrl && (
                <span className="text-[#8C857B]">Ready to add details</span>
              )}
            </div>

            <button
              type="button"
              onClick={handleNextStep}
              className="w-full mt-4 py-3.5 rounded-2xl bg-[#587B6C] hover:bg-[#48685A] text-white font-display font-bold text-xs uppercase tracking-wider shadow-sage active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Continue to Step 2</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: LOCATION & DESCRIPTION */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            
            {/* Category Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#2C4A3E] uppercase mb-2">
                Action Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'Clean-up Drive',
                  'Tree Planting',
                  'Solar Energy',
                  'Composting',
                  'Cycling / Walking'
                ].map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`p-2.5 rounded-xl text-xs font-medium text-left border transition-all ${
                      category === cat
                        ? 'bg-[#E8EFEA] border-[#587B6C] text-[#2C4A3E] font-bold shadow-sm'
                        : 'bg-[#FAF8F5] border-[#E2DDD1] text-[#64786E] hover:border-gray-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Name */}
            <div>
              <label className="block text-xs font-semibold text-[#2C4A3E] uppercase mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#587B6C]" />
                <span>Where did this take place?</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Alandi Riverbank, Pune"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2DDD1] focus:border-[#587B6C] focus:bg-white outline-none text-xs text-[#2C4A3E] placeholder-gray-400 transition-colors"
                required
              />

              {/* Quick Preset Location Pills */}
              <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-[#8C857B] uppercase font-medium">Quick picks:</span>
                {SAMPLE_LOCATIONS.map((preset) => (
                  <button
                    type="button"
                    key={preset.name}
                    onClick={() => handleSelectPresetLocation(preset)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-[#F5F2EB] hover:bg-[#E8EFEA] hover:text-[#2C4A3E] border border-[#E2DDD1] text-[#64786E] transition-colors"
                  >
                    {preset.name.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* 1-Sentence Description */}
            <div>
              <label className="block text-xs font-semibold text-[#2C4A3E] uppercase mb-1">
                Describe your action in 1 simple sentence
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Planted 5 neem saplings with friends to restore shade near the riverbank."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2DDD1] focus:border-[#587B6C] focus:bg-white outline-none text-xs text-[#2C4A3E] placeholder-gray-400 resize-none transition-colors"
                required
              />
            </div>

            {/* Reward Preview */}
            <div className="p-3 rounded-2xl bg-[#E8EFEA] border border-[#7C9D8E]/30 text-xs">
              <div className="flex items-center gap-1.5 text-[#2C4A3E] font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#587B6C]" />
                <span>AUTOMATED PHOTO CHECK</span>
              </div>
              <div className="flex justify-between text-[#5C6E66] text-[11px]">
                <span>Estimated Impact:</span>
                <span className="text-[#2C4A3E] font-bold">~8 - 40 kg CO₂</span>
              </div>
              <div className="flex justify-between text-[#5C6E66] text-[11px] mt-0.5">
                <span>Green Points Reward:</span>
                <span className="text-[#587B6C] font-bold">+50 - 100 🌱 Points</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#E2DDD1] text-[#64786E] hover:text-[#2C4A3E] text-xs font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-2xl bg-[#587B6C] hover:bg-[#48685A] text-white font-display font-bold text-xs uppercase tracking-wider shadow-sage active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Running Photo Check...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    <span>Submit & Claim Points</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
