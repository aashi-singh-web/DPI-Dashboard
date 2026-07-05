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
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import AppTable from '../components/AppTable';
import AppPieChart from '../components/Charts/AppPieChart';
import PacketsBarChart from '../components/Charts/PacketsBarChart';
import ThreadLineChart from '../components/Charts/ThreadLineChart';
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

          {isPending && (
            <div className="glass p-5">
              <ProgressBar label="Uploading & analyzing" value={progress} total={100} color="cyan" />
              <p className="mt-3 flex items-center gap-2 font-mono text-xs text-slate-500">
                <FiLoader className="animate-spin" /> Running the engine — this can take a moment
                on larger captures.
              </p>
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
              <div className="glass p-6">
                <h3 className="label-eyebrow mb-4">Applications</h3>
                <AppPieChart applications={data.statistics.applications} />
              </div>
              <div className="glass p-6">
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
