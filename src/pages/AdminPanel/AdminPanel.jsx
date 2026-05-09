import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const AdminPanel = () => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('reports');
  const [reports, setReports] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [team, setTeam] = useState([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', role: 'support', email: '' });

  const bgColor = darkMode ? '#0a0f0d' : '#f0f4f8';
  const cardBg = darkMode ? '#1a2a24' : '#ffffff';
  const textColor = darkMode ? '#d4f1d9' : '#1a2a24';
  const subText = darkMode ? '#8aa899' : '#5a7a6a';
  const borderColor = darkMode ? '#2a4a3a' : '#e0e0e0';

  useEffect(() => {
    loadReports();
    loadVolunteerData();
    loadTeamData();
  }, []);

  const loadReports = () => {
    const stored = localStorage.getItem('emergency_reports');
    if (stored) setReports(JSON.parse(stored));
  };

  const loadVolunteerData = () => {
    const storedOps = localStorage.getItem('volunteer_opportunities');
    if (storedOps) setOpportunities(JSON.parse(storedOps));
    const storedApps = localStorage.getItem('volunteer_applications');
    if (storedApps) setApplications(JSON.parse(storedApps));
  };

  const loadTeamData = () => {
    const stored = localStorage.getItem('team_members');
    if (stored) setTeam(JSON.parse(stored));
    else {
      const defaultTeam = [
        { id: 1, name: 'أحمد محمد', role: 'admin', email: 'ahmed@fatimi.com', avatar: '👨‍💻' },
        { id: 2, name: 'فاطمة علي', role: 'moderator', email: 'fatima@fatimi.com', avatar: '👩‍💻' },
        { id: 3, name: 'حسين رضا', role: 'support', email: 'hussein@fatimi.com', avatar: '🛠️' },
      ];
      setTeam(defaultTeam);
      localStorage.setItem('team_members', JSON.stringify(defaultTeam));
    }
  };

  const addTeamMember = () => {
    if (!newMember.name || !newMember.email) {
      alert('⚠️ الرجاء إدخال الاسم والبريد الإلكتروني');
      return;
    }
    const newId = Math.max(...team.map(m => m.id), 0) + 1;
    const member = { ...newMember, id: newId, avatar: newMember.role === 'admin' ? '👨‍💻' : newMember.role === 'moderator' ? '👩‍💻' : '🛠️' };
    const updatedTeam = [...team, member];
    setTeam(updatedTeam);
    localStorage.setItem('team_members', JSON.stringify(updatedTeam));
    setNewMember({ name: '', role: 'support', email: '' });
    setShowAddMember(false);
  };

  const deleteTeamMember = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العضو؟')) {
      const updated = team.filter(m => m.id !== id);
      setTeam(updated);
      localStorage.setItem('team_members', JSON.stringify(updated));
    }
  };

  const getRoleName = (role) => {
    switch(role) {
      case 'admin': return 'مدير';
      case 'moderator': return 'مشرف';
      case 'support': return 'دعم فني';
      default: return role;
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return { text: '⏳ قيد الانتظار', color: '#e0b074' };
      case 'processing': return { text: '🔄 جاري المعالجة', color: '#3b82f6' };
      case 'completed': return { text: '✅ تم المعالجة', color: '#10b981' };
      default: return { text: status, color: '#6b7280' };
    }
  };

  const tabs = [
    { id: 'reports', name: '🚨 البلاغات', icon: '🚨' },
    { id: 'volunteer', name: '🤝 التطوع', icon: '🤝' },
    { id: 'team', name: '👥 أعضاء الفريق', icon: '👥' },
  ];

  return (
    <div style={{ backgroundColor: bgColor, minHeight: '100vh', direction: 'rtl', padding: '16px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: textColor }}>👑 لوحة الإدارة المتكاملة</div>
          <div style={{ fontSize: '12px', color: subText, marginTop: '4px' }}>إدارة البلاغات | التطوع | فريق العمل</div>
          <a href="/" style={{ display: 'inline-block', marginTop: '8px', color: '#e0b074', textDecoration: 'none' }}>← العودة للرئيسية</a>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', backgroundColor: cardBg, borderRadius: '12px', padding: '4px' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer', backgroundColor: activeTab === tab.id ? '#e0b074' : 'transparent', color: activeTab === tab.id ? '#0a0f0d' : textColor, fontWeight: 'bold' }}>
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>

        {/* تبويب البلاغات */}
        {activeTab === 'reports' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#e0b074' }}>{reports.filter(r => r.status === 'pending').length}</div>
                <div style={{ fontSize: '12px', color: subText }}>قيد الانتظار</div>
              </div>
              <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6' }}>{reports.filter(r => r.status === 'processing').length}</div>
                <div style={{ fontSize: '12px', color: subText }}>جاري المعالجة</div>
              </div>
              <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>{reports.filter(r => r.status === 'completed').length}</div>
                <div style={{ fontSize: '12px', color: subText }}>تم المعالجة</div>
              </div>
            </div>
            {reports.length === 0 ? (
              <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: '40px', textAlign: 'center', color: subText }}>لا توجد بلاغات</div>
            ) : (
              reports.map(report => (
                <div key={report.id} style={{ backgroundColor: cardBg, borderRadius: '16px', padding: '16px', marginBottom: '12px', borderRight: `4px solid ${getStatusBadge(report.status).color}` }}>
                  <div><strong>{report.reportTypeName}</strong> - {report.location}</div>
                  <div style={{ fontSize: '12px', color: subText }}>{report.description}</div>
                  <div style={{ fontSize: '11px', color: subText, marginTop: '4px' }}>{new Date(report.createdAt).toLocaleString('ar-SA')}</div>
                </div>
              ))
            )}
          </div>
        )}

        {/* تبويب التطوع */}
        {activeTab === 'volunteer' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>📋 طلبات التطوع</div>
              {applications.length === 0 ? (
                <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: '20px', textAlign: 'center', color: subText }}>لا توجد طلبات تطوع</div>
              ) : (
                applications.map(app => (
                  <div key={app.id} style={{ backgroundColor: cardBg, borderRadius: '12px', padding: '12px', marginBottom: '8px' }}>
                    <div><strong>{app.name}</strong> - {app.opportunityTitle}</div>
                    <div style={{ fontSize: '12px', color: subText }}>📞 {app.phone}</div>
                  </div>
                ))
              )}
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>🤝 الفرص التطوعية</div>
              {opportunities.map(opp => (
                <div key={opp.id} style={{ backgroundColor: cardBg, borderRadius: '12px', padding: '12px', marginBottom: '8px' }}>
                  <div><strong>{opp.title}</strong> - {opp.location}</div>
                  <div style={{ fontSize: '12px', color: subText }}>📅 {opp.date} | 👥 {opp.filled}/{opp.slots}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* تبويب أعضاء الفريق */}
        {activeTab === 'team' && (
          <div>
            <button onClick={() => setShowAddMember(true)} style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px' }}>➕ إضافة عضو جديد</button>
            {team.map(member => (
              <div key={member.id} style={{ backgroundColor: cardBg, borderRadius: '12px', padding: '12px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><span style={{ fontSize: '24px' }}>{member.avatar}</span> <strong>{member.name}</strong> - {getRoleName(member.role)}</div>
                <button onClick={() => deleteTeamMember(member.id)} style={{ backgroundColor: '#dc2626', border: 'none', borderRadius: '8px', color: 'white', padding: '4px 12px', cursor: 'pointer' }}>حذف</button>
              </div>
            ))}
          </div>
        )}

        {/* نافذة إضافة عضو */}
        {showAddMember && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: cardBg, borderRadius: '24px', padding: '24px', width: '90%', maxWidth: '400px' }}>
              <h3 style={{ color: textColor, marginBottom: '16px' }}>➕ إضافة عضو جديد</h3>
              <input type="text" placeholder="الاسم الكامل" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: darkMode ? '#0a0f0d' : '#fff', color: textColor }} />
              <input type="email" placeholder="البريد الإلكتروني" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: darkMode ? '#0a0f0d' : '#fff', color: textColor }} />
              <select value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })} style={{ width: '100%', padding: '10px', marginBottom: '16px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: darkMode ? '#0a0f0d' : '#fff', color: textColor }}>
                <option value="admin">مدير</option>
                <option value="moderator">مشرف</option>
                <option value="support">دعم فني</option>
              </select>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={addTeamMember} style={{ flex: 1, padding: '10px', backgroundColor: '#10b981', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>إضافة</button>
                <button onClick={() => setShowAddMember(false)} style={{ flex: 1, padding: '10px', backgroundColor: '#dc2626', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>إلغاء</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
