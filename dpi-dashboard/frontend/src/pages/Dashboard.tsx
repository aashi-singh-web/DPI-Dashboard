import { useEffect, useRef, useState } from 'react';
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
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import AppTable from '../components/AppTable';
import AppPieChart from '../components/Charts/AppPieChart';
import PacketsBarChart from '../components/Charts/PacketsBarChart';
import ThreadLineChart from '../components/Charts/ThreadLineChart';
import PacketPipelineAnimation from '../components/PacketPipelineAnimation';
import { useAnalyze } from '../hooks/useAnalyze';
import { downloadUrl } from '../services/api';
import { generatePdfReport } from '../utils/generatePdfReport';
import type { BlockingRules } from '../types';

const PIPELINE_MIN_MS = 4500;

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [rules, setRules] = useState<BlockingRules>({ apps: [], domains: [], ips: [] });
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showPipeline, setShowPipeline] = useState(false);
  const pipelineStartRef = useRef<number | null>(null);
  const { mutate, data, error, isPending, reset } = useAnalyze();

  useEffect(() => {
    if (isPending || !showPipeline) return;

    const start = pipelineStartRef.current ?? Date.now();
    const remaining = Math.max(0, PIPELINE_MIN_MS - (Date.now() - start));
    const timer = setTimeout(() => setShowPipeline(false), remaining);
    return () => clearTimeout(timer);
  }, [isPending, showPipeline]);

  function handleAnalyze() {
    if (!file) return;
    pipelineStartRef.current = Date.now();
    setShowPipeline(true);
    mutate({ file, rules });
  }

  function handleReset() {
    setFile(null);
    setShowPipeline(false);
    pipelineStartRef.current = null;
    reset();
  }

  async function handleDownloadPdf() {
    if (!data) return;
    setPdfLoading(true);
    try {
      await generatePdfReport(data, { pie: 'chart-pie', bar: 'chart-bar' });
    } finally {
      setPdfLoading(false);
    }
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

      <AnimatePresence mode="wait">
        {showPipeline && (
          <motion.div
            key="pipeline"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-10"
          >
            <PacketPipelineAnimation />
          </motion.div>
        )}
      </AnimatePresence>

      {!data && !showPipeline && (
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
            disabled={!file}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            Analyze Capture
          </button>
        </div>
      )}

      <AnimatePresence>
        {data && !showPipeline && (
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
              <div className="flex flex-wrap gap-3">
                <a href={downloadUrl(data.outputFile)} className="btn-primary">
                  <FiDownload /> Download output.pcap
                </a>
                <button
                  onClick={handleDownloadPdf}
                  disabled={pdfLoading}
                  className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {pdfLoading ? (
                    <>
                      <FiLoader className="animate-spin" /> Generating…
                    </>
                  ) : (
                    <>📄 Download PDF Report</>
                  )}
                </button>
                <button onClick={handleReset} className="btn-secondary">
                  New analysis
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              <StatCard label="Total packets" value={data.statistics.totalPackets} icon={FiPackage} accent="cyan" />
              <StatCard label="TCP" value={data.statistics.tcpPackets} icon={FiShare2} accent="cyan" />
              <StatCard label="UDP" value={data.statistics.udpPackets} icon={FiShare2} accent="amber" />
              <StatCard label="Forwarded" value={data.statistics.forwarded} icon={FiDownloadCloud} accent="signal" />
              <StatCard label="Dropped" value={data.statistics.dropped} icon={FiAlertTriangle} accent="alert" />
            </div>

            <div className="glass p-6">
              <h3 className="label-eyebrow mb-5">Blocked vs forwarded</h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <ProgressBar
                  label="Forwarded"
                  value={data.statistics.forwarded}
                  total={data.statistics.totalPackets}
                  color="signal"
                />
                <ProgressBar
                  label="Dropped"
                  value={data.statistics.dropped}
                  total={data.statistics.totalPackets}
                  color="alert"
                />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div id="chart-pie" className="glass p-6">
                <h3 className="label-eyebrow mb-4">Applications</h3>
                <AppPieChart applications={data.statistics.applications} />
              </div>
              <div id="chart-bar" className="glass p-6">
                <h3 className="label-eyebrow mb-4">Packets by app</h3>
                <PacketsBarChart applications={data.statistics.applications} />
              </div>
            </div>

            <div className="glass p-6">
              <h3 className="label-eyebrow mb-4">Thread usage</h3>
              <ThreadLineChart threads={data.statistics.threads} />
            </div>

            <div>
              <h3 className="label-eyebrow mb-4">Detected applications</h3>
              <AppTable
                applications={data.statistics.applications}
                blockedApps={data.appliedRules.apps}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
