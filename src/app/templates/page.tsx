'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import LogoTemplateGallery from '@/components/LogoTemplateGallery';
import TemplateEditor from '@/components/TemplateEditor';
import toast from 'react-hot-toast';

interface LogoTemplate {
  id: string;
  name: string;
  category: string;
  style: string;
  colors: string[];
  preview: string;
  isPopular?: boolean;
  tags: string[];
}

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<LogoTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<LogoTemplate | null>(null);

  const handleSelectTemplate = (template: LogoTemplate) => {
    // When a user selects a template, we can either:
    // 1. Navigate to the generate page with the template data
    // 2. Apply it directly to their current branding
    
    // Store the selected template in localStorage for the generate page
    localStorage.setItem('selected_template', JSON.stringify(template));
    
    toast.success(`${template.name} template selected!`);
    router.push('/generate?template=' + template.id);
  };

  const handleEditTemplate = (template: LogoTemplate) => {
    setEditingTemplate(template);
  };

  const handleSaveEditedTemplate = (editedTemplate: LogoTemplate) => {
    // In a real app, you'd save this to a user's custom templates
    // For now, we'll just close the editor and show a success message
    setEditingTemplate(null);
    toast.success('Template customized successfully!');
    
    // You could also navigate to the generate page with the edited template
    localStorage.setItem('selected_template', JSON.stringify(editedTemplate));
    router.push('/generate?template=' + editedTemplate.id);
  };

  const handleCloseEditor = () => {
    setEditingTemplate(null);
  };

  if (editingTemplate) {
    return (
      <TemplateEditor
        template={editingTemplate}
        onClose={handleCloseEditor}
        onSave={handleSaveEditedTemplate}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main>
        <LogoTemplateGallery
          onSelectTemplate={handleSelectTemplate}
          onEditTemplate={handleEditTemplate}
        />
      </main>
    </div>
  );
}