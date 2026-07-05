import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPackage,
  FiShare2,
  FiDownloadCloud,
  FiAlertTriangle,
  FiCheckCircle,
  FiDownload,
  FiLoader,
} from 'react-icons/fi';
import UploadZone from '../components/UploadZone';
import BlockingPanel from '../components/BlockingPanel';
import { useAnalyze } from '../hooks/useAnalyze';
import { downloadUrl } from '../services/api';
import type { BlockingRules } from '../types';

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [rules, setRules] = useState<BlockingRules>({ apps: [], domains: [], ips: [] });
  const { mutate, data, error, isPending, progress, reset } = useAnalyze();

  function handleAnalyze() {
    if (!file) return;
    mutate({ file, rules });
  }

  function handleReset() {
    setFile(null);
    reset();
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="label-eyebrow">Dashboard</p>
      <h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
        Run an analysis
      </h1>
      <p className="mt-3 max-w-2xl text-slate-400">
        Upload a capture, choose what to block, and the engine will do the rest.
      </p>

      {!data && (
        <div className="mt-10 space-y-6">
          <UploadZone selectedFile={file} onFileSelected={setFile} />
          <BlockingPanel rules={rules} onChange={setRules} />

          {error && (
            <div className="glass flex items-start gap-3 border-alert/40 p-4">
              <FiAlertTriangle className="mt-0.5 flex-shrink-0 text-alert" />
              <div>
                <p className="font-mono text-sm font-semibold text-alert">Analysis failed</p>
                <p className="mt-1 text-sm text-slate-400">{error.message}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!file || isPending}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            {isPending ? (
              <>
                <FiLoader className="animate-spin" /> Analyzing
              </>
            ) : (
              <>Analyze Capture</>
            )}
          </button>
        </div>
      )}

      <AnimatePresence>
        {data && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 space-y-8"
          >
            <div className="glass flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <FiCheckCircle className="text-signal" size={20} />
                <div>
                  <p className="font-mono text-sm text-white">Analysis complete</p>
                  <p className="font-mono text-xs text-slate-500">{data.originalName}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <a href={downloadUrl(data.outputFile)} className="btn-primary">
                  <FiDownload /> Download output.pcap
                </a>
                <button onClick={handleReset} className="btn-secondary">
                  New analysis
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
