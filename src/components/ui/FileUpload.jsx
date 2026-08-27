import { useCallback, useState } from 'react';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

export default function FileUpload({ label, accept = '*', onFile, hint, className = '' }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile]         = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFile = useCallback((f) => {
    if (!f) return;
    setFile(f);
    // Simulate upload progress
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 20;
      if (p >= 100) { p = 100; clearInterval(iv); }
      setProgress(Math.min(p, 100));
    }, 150);
    onFile?.(f);
  }, [onFile]);

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      {label && <label className="input-label">{label}</label>}

      {!file ? (
        <div
          onDragEnter={() => setDragging(true)}
          onDragLeave={() => setDragging(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className={clsx(
            'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
            dragging
              ? 'border-gov-500 bg-gov-500/10'
              : 'border-surface-border hover:border-gov-600 hover:bg-gov-900/20'
          )}
          onClick={() => document.getElementById('file-input-hidden').click()}
        >
          <input
            id="file-input-hidden"
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <Upload size={32} className="mx-auto text-gov-400 mb-3" />
          <p className="text-sm text-white/70 font-medium">Drop file here or <span className="text-gov-400">browse</span></p>
          {hint && <p className="text-xs text-white/35 mt-1">{hint}</p>}
        </div>
      ) : (
        <div className="glass rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 bg-gov-500/15 rounded-lg">
            {progress >= 100 ? <CheckCircle size={20} className="text-accent-green" /> : <FileText size={20} className="text-gov-400" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium truncate">{file.name}</p>
            <div className="mt-1.5 h-1.5 bg-surface-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gov-600 to-cyber-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-white/40 mt-1">
              {progress >= 100 ? 'Upload complete' : `Uploading… ${Math.round(progress)}%`}
            </p>
          </div>
          <button onClick={() => { setFile(null); setProgress(0); }} className="btn-ghost p-1.5 rounded-lg">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
