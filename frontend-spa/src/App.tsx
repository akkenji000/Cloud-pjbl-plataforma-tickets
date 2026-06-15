import { useEffect, useState } from 'react';
import axios from 'axios';

interface Evento {
  id: string; nome: string; data: string; local: string;
  capacidade: number; precoBase: number; categoria: string; status: string;
}
interface Pedido {
  id: number; eventoId: string; clienteNome: string; clienteEmail: string;
  quantidade: number; valorTotal: number; status: string; dataPedido: string;
}
interface DashboardData {
  usuarioId: string;
  taxaConvenienciaAtual: { percentualAplicado: number; valorTaxa: number; mensagem: string; origem: string; };
  eventosEmDestaque: Evento[];
  meusUltimosPedidos: Pedido[];
}

const categoriaIcon: Record<string, string> = {
  Musica: '🎵', Teatro: '🎭', Esporte: '⚽', Festival: '🎪', Cinema: '🎬', Stand: '🎤', Default: '🎫',
};
const statusColor: Record<string, string> = {
  Disponivel: '#22c55e', Ativo: '#22c55e', Esgotado: '#ef4444',
  Cancelado: '#6b7280', Confirmado: '#3b82f6', Pendente: '#f59e0b',
};

function Badge({ status }: { status: string }) {
  const c = statusColor[status] ?? '#6b7280';
  return (
    <span style={{ padding: '2px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700,
      backgroundColor: c + '22', color: c, border: `1px solid ${c}55` }}>
      {status.toUpperCase()}
    </span>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: '#000000cc', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ background: '#1a1a24', border: '1px solid #ffffff18', borderRadius: '16px',
        padding: '28px', width: '100%', maxWidth: '480px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#fff' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b',
            fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', background: '#0f0f13', border: '1px solid #ffffff18',
  borderRadius: '8px', color: '#e2e8f0', fontSize: '14px', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', color: '#94a3b8',
  marginBottom: '4px', fontWeight: 600 };
const fieldStyle: React.CSSProperties = { marginBottom: '14px' };
const btnPrimary: React.CSSProperties = { width: '100%', padding: '12px', background: '#7c3aed',
  color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', marginTop: '4px' };

function NovoEventoForm({ onSuccess }: { onSuccess: () => void; onClose: () => void }) {
  const [form, setForm] = useState({ nome: '', data: '', local: '', capacidade: '', precoBase: '', categoria: 'Musica', status: 'Disponivel' });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    setSaving(true);
    try {
      await axios.post('/api/eventos', {
        ...form, capacidade: Number(form.capacidade), precoBase: Number(form.precoBase),
      });
      onSuccess();
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div style={fieldStyle}><label style={labelStyle}>Nome do Evento</label>
        <input style={inputStyle} value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Ex: Show de Rock" /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={fieldStyle}><label style={labelStyle}>Data</label>
          <input style={inputStyle} type="datetime-local" value={form.data} onChange={e => set('data', e.target.value)} /></div>
        <div style={fieldStyle}><label style={labelStyle}>Capacidade</label>
          <input style={inputStyle} type="number" value={form.capacidade} onChange={e => set('capacidade', e.target.value)} placeholder="5000" /></div>
      </div>
      <div style={fieldStyle}><label style={labelStyle}>Local</label>
        <input style={inputStyle} value={form.local} onChange={e => set('local', e.target.value)} placeholder="Ex: Arena SP" /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={fieldStyle}><label style={labelStyle}>Categoria</label>
          <select style={inputStyle} value={form.categoria} onChange={e => set('categoria', e.target.value)}>
            {['Musica', 'Teatro', 'Esporte', 'Festival', 'Cinema', 'Stand'].map(c =>
              <option key={c}>{c}</option>)}
          </select></div>
        <div style={fieldStyle}><label style={labelStyle}>Preço Base (R$)</label>
          <input style={inputStyle} type="number" value={form.precoBase} onChange={e => set('precoBase', e.target.value)} placeholder="150.00" /></div>
      </div>
      <button style={btnPrimary} onClick={submit} disabled={saving}>
        {saving ? 'Salvando...' : '🎫 Cadastrar Evento'}
      </button>
    </div>
  );
}

function EditEventoForm({ evento, onSuccess }: { evento: Evento; onSuccess: () => void; onClose: () => void }) {
  const toLocalDatetime = (iso: string) => {
    try { return new Date(iso).toISOString().slice(0, 16); } catch { return ''; }
  };
  const [form, setForm] = useState({
    nome: evento.nome, data: toLocalDatetime(evento.data), local: evento.local,
    capacidade: String(evento.capacidade), precoBase: String(evento.precoBase),
    categoria: evento.categoria, status: evento.status,
  });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    setSaving(true);
    try {
      await axios.put(`/api/eventos/${evento.id}`, {
        ...form, capacidade: Number(form.capacidade), precoBase: Number(form.precoBase),
      });
      onSuccess();
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div style={fieldStyle}><label style={labelStyle}>Nome do Evento</label>
        <input style={inputStyle} value={form.nome} onChange={e => set('nome', e.target.value)} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={fieldStyle}><label style={labelStyle}>Data</label>
          <input style={inputStyle} type="datetime-local" value={form.data} onChange={e => set('data', e.target.value)} /></div>
        <div style={fieldStyle}><label style={labelStyle}>Capacidade</label>
          <input style={inputStyle} type="number" value={form.capacidade} onChange={e => set('capacidade', e.target.value)} /></div>
      </div>
      <div style={fieldStyle}><label style={labelStyle}>Local</label>
        <input style={inputStyle} value={form.local} onChange={e => set('local', e.target.value)} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={fieldStyle}><label style={labelStyle}>Categoria</label>
          <select style={inputStyle} value={form.categoria} onChange={e => set('categoria', e.target.value)}>
            {['Musica', 'Teatro', 'Esporte', 'Festival', 'Cinema', 'Stand'].map(c =>
              <option key={c}>{c}</option>)}
          </select></div>
        <div style={fieldStyle}><label style={labelStyle}>Status</label>
          <select style={inputStyle} value={form.status} onChange={e => set('status', e.target.value)}>
            {['Disponivel', 'Esgotado', 'Cancelado'].map(s => <option key={s}>{s}</option>)}
          </select></div>
      </div>
      <div style={fieldStyle}><label style={labelStyle}>Preço Base (R$)</label>
        <input style={inputStyle} type="number" value={form.precoBase} onChange={e => set('precoBase', e.target.value)} /></div>
      <button style={btnPrimary} onClick={submit} disabled={saving}>
        {saving ? 'Salvando...' : '💾 Salvar Alterações'}
      </button>
    </div>
  );
}

function EditPedidoForm({ pedido, onSuccess }: { pedido: Pedido; onSuccess: () => void; onClose: () => void }) {
  const [status, setStatus] = useState(pedido.status);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      await axios.put(`/api/pedidos/${pedido.id}`, { ...pedido, status });
      onSuccess();
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div style={{ background: '#0f0f13', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px',
        fontSize: '13px', color: '#94a3b8', lineHeight: '1.9' }}>
        <div><span style={{ color: '#64748b' }}>Pedido</span> <strong style={{ color: '#fff' }}>#{pedido.id}</strong></div>
        <div><span style={{ color: '#64748b' }}>Cliente</span> <strong style={{ color: '#fff' }}>{pedido.clienteNome}</strong></div>
        <div><span style={{ color: '#64748b' }}>Ingressos</span> <strong style={{ color: '#fff' }}>{pedido.quantidade}x</strong></div>
        <div><span style={{ color: '#64748b' }}>Total</span> <strong style={{ color: '#22c55e' }}>R$ {pedido.valorTotal.toFixed(2)}</strong></div>
      </div>
      <div style={fieldStyle}><label style={labelStyle}>Novo Status</label>
        <select style={inputStyle} value={status} onChange={e => setStatus(e.target.value)}>
          {['Pendente', 'Confirmado', 'Cancelado'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <button style={btnPrimary} onClick={submit} disabled={saving}>
        {saving ? 'Salvando...' : '💾 Atualizar Status'}
      </button>
    </div>
  );
}

function NovoPedidoForm({ eventos, onSuccess }: { eventos: Evento[]; onSuccess: () => void; onClose: () => void }) {
  const [form, setForm] = useState({ eventoId: eventos[0]?.id ?? '', clienteNome: '', clienteEmail: '', quantidade: '1' });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const eventoSelecionado = eventos.find(e => e.id === form.eventoId);
  const valorTotal = eventoSelecionado ? eventoSelecionado.precoBase * Number(form.quantidade) : 0;

  const submit = async () => {
    setSaving(true);
    try {
      await axios.post('/api/pedidos', {
        eventoId: form.eventoId, clienteNome: form.clienteNome,
        clienteEmail: form.clienteEmail, quantidade: Number(form.quantidade),
        valorTotal, status: 'Pendente', dataPedido: new Date().toISOString(),
      });
      onSuccess();
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div style={fieldStyle}><label style={labelStyle}>Evento</label>
        <select style={inputStyle} value={form.eventoId} onChange={e => set('eventoId', e.target.value)}>
          {eventos.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
        </select></div>
      <div style={fieldStyle}><label style={labelStyle}>Nome do Cliente</label>
        <input style={inputStyle} value={form.clienteNome} onChange={e => set('clienteNome', e.target.value)} placeholder="Ex: Arthur Kenji" /></div>
      <div style={fieldStyle}><label style={labelStyle}>E-mail</label>
        <input style={inputStyle} type="email" value={form.clienteEmail} onChange={e => set('clienteEmail', e.target.value)} placeholder="cliente@email.com" /></div>
      <div style={fieldStyle}><label style={labelStyle}>Quantidade de Ingressos</label>
        <input style={inputStyle} type="number" min="1" value={form.quantidade} onChange={e => set('quantidade', e.target.value)} /></div>
      {valorTotal > 0 && (
        <div style={{ background: '#0f0f13', border: '1px solid #7c3aed44', borderRadius: '8px',
          padding: '10px 14px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#94a3b8', fontSize: '13px' }}>Total estimado</span>
          <span style={{ color: '#a855f7', fontWeight: 800, fontSize: '16px' }}>R$ {valorTotal.toFixed(2)}</span>
        </div>
      )}
      <button style={btnPrimary} onClick={submit} disabled={saving || !form.clienteNome || !form.eventoId}>
        {saving ? 'Processando...' : '🛒 Confirmar Pedido'}
      </button>
    </div>
  );
}

type ModalType = 'evento' | 'pedido' | 'edit-evento' | 'edit-pedido' | null;

const iconBtn = (color: string): React.CSSProperties => ({
  background: color + '18', border: `1px solid ${color}44`, color,
  borderRadius: '6px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer', fontWeight: 700,
});

export default function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);

  const fetchData = () => {
    setLoading(true);
    axios.get('/api/aggregated-data', { headers: { 'x-user-id': 'kenji-dev' } })
      .then(r => setData(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSuccess = () => { setModal(null); setSelectedEvento(null); setSelectedPedido(null); fetchData(); };
  const closeModal = () => { setModal(null); setSelectedEvento(null); setSelectedPedido(null); };

  const handleDeleteEvento = async (id: string) => {
    if (!confirm('Deletar este evento?')) return;
    await axios.delete(`/api/eventos/${id}`);
    fetchData();
  };

  const handleDeletePedido = async (id: number) => {
    if (!confirm('Deletar este pedido?')) return;
    await axios.delete(`/api/pedidos/${id}`);
    fetchData();
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: '16px', backgroundColor: '#0f0f13', color: '#94a3b8' }}>
      <div style={{ fontSize: '48px' }}>🎫</div><div>Carregando plataforma...</div>
    </div>
  );
  if (!data) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: '16px', backgroundColor: '#0f0f13' }}>
      <div style={{ fontSize: '48px' }}>⚠️</div>
      <div style={{ color: '#ef4444' }}>Erro de conexão com o BFF.</div>
    </div>
  );

  const taxa = data.taxaConvenienciaAtual;
  const isVip = taxa.percentualAplicado < 10;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f13', color: '#e2e8f0', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #1a0533 0%, #0d1b4b 100%)',
        borderBottom: '1px solid #ffffff18', padding: '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🎫</span>
          <span style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>
            Ticket<span style={{ color: '#a855f7' }}>Hub</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => setModal('evento')} style={{ background: '#7c3aed', color: '#fff',
            border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px',
            fontWeight: 700, cursor: 'pointer' }}>
            + Novo Evento
          </button>
          <button onClick={() => setModal('pedido')} disabled={data.eventosEmDestaque.length === 0}
            style={{ background: data.eventosEmDestaque.length > 0 ? '#1e3a5f' : '#1a1a24',
              color: data.eventosEmDestaque.length > 0 ? '#60a5fa' : '#475569',
              border: '1px solid currentColor', borderRadius: '8px', padding: '8px 16px',
              fontSize: '13px', fontWeight: 700, cursor: data.eventosEmDestaque.length > 0 ? 'pointer' : 'not-allowed' }}>
            + Novo Pedido
          </button>
          <span style={{ backgroundColor: '#ffffff12', border: '1px solid #ffffff20',
            borderRadius: '20px', padding: '6px 14px', fontSize: '13px', color: '#cbd5e1' }}>
            {isVip ? '⭐ VIP — ' : '👤 '}{data.usuarioId}
          </span>
        </div>
      </header>

      {/* Hero / Taxa */}
      <div style={{ background: 'linear-gradient(135deg, #1a0533 0%, #0d1b4b 50%, #0f0f13 100%)',
        padding: '40px 40px 36px', borderBottom: '1px solid #ffffff10' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 4px', color: '#fff' }}>
          Seu Dashboard de Ingressos
        </h1>
        <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 20px' }}>
          {data.eventosEmDestaque.length} evento(s) disponível(is) · {data.meusUltimosPedidos.length} pedido(s) realizado(s)
        </p>
        <div style={{ background: 'linear-gradient(135deg, #7c3aed22, #2563eb22)',
          border: '1px solid #7c3aed44', borderRadius: '12px', padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '520px' }}>
          <span style={{ fontSize: '32px' }}>{isVip ? '⭐' : '🏷️'}</span>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '2px', fontWeight: 600 }}>
              TAXA DE CONVENIÊNCIA ATIVA
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#a855f7' }}>
              {taxa.percentualAplicado}%
              {taxa.valorTaxa != null && (
                <span style={{ fontSize: '14px', fontWeight: 400, color: '#94a3b8', marginLeft: '8px' }}>
                  (R$ {taxa.valorTaxa.toFixed(2)})
                </span>
              )}
            </div>
            <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '2px' }}>{taxa.mensagem}</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>⚙️ {taxa.origem}</div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <main style={{ padding: '32px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>

        {/* Eventos */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '1px', color: '#64748b' }}>
              🎸 Eventos em Destaque
            </span>
            <span style={{ fontSize: '12px', color: '#475569' }}>{data.eventosEmDestaque.length} resultado(s)</span>
          </div>
          {data.eventosEmDestaque.length === 0
            ? <div style={{ textAlign: 'center', padding: '40px 20px', color: '#475569',
                background: '#1a1a24', border: '1px dashed #ffffff15', borderRadius: '12px' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎫</div>
                Nenhum evento cadastrado.<br />
                <span style={{ fontSize: '12px' }}>Clique em "+ Novo Evento" para começar.</span>
              </div>
            : data.eventosEmDestaque.map(evento => (
              <div key={evento.id} style={{ background: '#1a1a24', border: '1px solid #ffffff10',
                borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
                <div style={{ background: 'linear-gradient(135deg, #1e1040, #0d1b4b)',
                  padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                      {categoriaIcon[evento.categoria] ?? '🎫'} {evento.nome}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.7' }}>
                      📅 {new Date(evento.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}<br />
                      📍 {evento.local}<br />
                      🎟️ {evento.capacidade.toLocaleString('pt-BR')} lugares · {evento.categoria}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                    <Badge status={evento.status} />
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                      <button style={iconBtn('#a855f7')} onClick={() => { setSelectedEvento(evento); setModal('edit-evento'); }}>
                        ✏️ Editar
                      </button>
                      <button style={iconBtn('#ef4444')} onClick={() => handleDeleteEvento(evento.id)}>
                        🗑️ Deletar
                      </button>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', borderTop: '1px solid #ffffff08' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', marginBottom: '2px' }}>A partir de</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#a855f7' }}>R$ {evento.precoBase.toFixed(2)}</div>
                  </div>
                  <button onClick={() => setModal('pedido')}
                    style={{ background: '#7c3aed', color: '#fff', border: 'none', padding: '8px 18px',
                      borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                    Comprar
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Pedidos */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '1px', color: '#64748b' }}>
              🛒 Meus Pedidos
            </span>
            <span style={{ fontSize: '12px', color: '#475569' }}>{data.meusUltimosPedidos.length} resultado(s)</span>
          </div>
          {data.meusUltimosPedidos.length === 0
            ? <div style={{ textAlign: 'center', padding: '40px 20px', color: '#475569',
                background: '#1a1a24', border: '1px dashed #ffffff15', borderRadius: '12px' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🛒</div>
                Nenhum pedido realizado.<br />
                <span style={{ fontSize: '12px' }}>Compre um ingresso para começar.</span>
              </div>
            : data.meusUltimosPedidos.map(pedido => (
              <div key={pedido.id} style={{ background: '#1a1a24', border: '1px solid #ffffff10',
                borderRadius: '12px', padding: '16px 20px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Pedido #{pedido.id}</span>
                  <Badge status={pedido.status} />
                </div>
                <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>👤 Cliente</span><span style={{ color: '#e2e8f0' }}>{pedido.clienteNome}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>✉️ E-mail</span><span style={{ color: '#e2e8f0' }}>{pedido.clienteEmail}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>🎟️ Ingressos</span><span style={{ color: '#e2e8f0' }}>{pedido.quantidade}x</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>📅 Data</span>
                    <span style={{ color: '#e2e8f0' }}>{new Date(pedido.dataPedido).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #ffffff08',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Evento: {pedido.eventoId.slice(0, 8)}...</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#22c55e' }}>R$ {pedido.valorTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button style={{ ...iconBtn('#60a5fa'), flex: 1 }}
                    onClick={() => { setSelectedPedido(pedido); setModal('edit-pedido'); }}>
                    ✏️ Editar Status
                  </button>
                  <button style={{ ...iconBtn('#ef4444'), flex: 1 }}
                    onClick={() => handleDeletePedido(pedido.id)}>
                    🗑️ Deletar
                  </button>
                </div>
              </div>
            ))}
        </div>
      </main>

      {/* Modais */}
      {modal === 'evento' && (
        <Modal title="🎫 Cadastrar Novo Evento" onClose={closeModal}>
          <NovoEventoForm onSuccess={handleSuccess} onClose={closeModal} />
        </Modal>
      )}
      {modal === 'edit-evento' && selectedEvento && (
        <Modal title="✏️ Editar Evento" onClose={closeModal}>
          <EditEventoForm evento={selectedEvento} onSuccess={handleSuccess} onClose={closeModal} />
        </Modal>
      )}
      {modal === 'pedido' && (
        <Modal title="🛒 Criar Pedido" onClose={closeModal}>
          <NovoPedidoForm eventos={data.eventosEmDestaque} onSuccess={handleSuccess} onClose={closeModal} />
        </Modal>
      )}
      {modal === 'edit-pedido' && selectedPedido && (
        <Modal title="✏️ Editar Pedido" onClose={closeModal}>
          <EditPedidoForm pedido={selectedPedido} onSuccess={handleSuccess} onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}
