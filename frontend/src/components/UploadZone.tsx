import { useCallback, useState } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { FiUploadCloud, FiFile, FiX } from 'react-icons/fi';

interface Props {
  onFileSelected: (file: File | null) => void;
  selectedFile: File | null;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export default function UploadZone({ onFileSelected, selectedFile }: Props) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      if (rejected.length > 0) {
        setError(rejected[0].errors[0]?.message || 'File rejected');
        return;
      }
      setError(null);
      onFileSelected(accepted[0] ?? null);
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024,
    accept: {
      'application/vnd.tcpdump.pcap': ['.pcap', '.cap'],
      'application/octet-stream': ['.pcap', '.pcapng', '.cap'],
    },
  });

  if (selectedFile) {
    return (
      <div className="glass flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-signal/10 text-signal">
            <FiFile size={22} />
          </span>
          <div>
            <p className="font-mono text-sm text-white">{selectedFile.name}</p>
            <p className="font-mono text-xs text-slate-400">{formatBytes(selectedFile.size)}</p>
          </div>
        </div>
        <button
          onClick={() => onFileSelected(null)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-slate-400 transition-colors hover:border-alert/50 hover:text-alert"
          aria-label="Remove file"
        >
          <FiX size={16} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`glass flex cursor-pointer flex-col items-center justify-center gap-3 border-dashed p-12 text-center transition-all duration-200 ${
          isDragActive ? 'border-cyan/70 bg-cyan/5 shadow-glow' : 'hover:border-cyan/40'
        }`}
      >
        <input {...getInputProps()} />
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan/10 text-cyan">
          <FiUploadCloud size={30} />
        </span>
        <p className="font-mono text-base text-white">
          {isDragActive ? 'Drop the capture here' : 'Drag & drop a .pcap file'}
        </p>
        <p className="text-sm text-slate-500">or click to browse — up to 100MB</p>
      </div>
      {error && <p className="mt-3 font-mono text-sm text-alert">{error}</p>}
    </div>
  );
}
