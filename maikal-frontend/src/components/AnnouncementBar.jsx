const TEXT = '🌾 Fresh harvest in stock — Order today, delivery in Bhopal & Indore only\u00a0\u00a0|\u00a0\u00a0📞 9926036075\u00a0\u00a0|\u00a0\u00a0✉️ maikalnatural@gmail.com\u00a0\u00a0\u00a0\u00a0';

export default function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      <div className="announcement-track">
        <span dangerouslySetInnerHTML={{ __html: TEXT.replace('Bhopal & Indore only', '<strong>Bhopal &amp; Indore only</strong>') }} />
        <span dangerouslySetInnerHTML={{ __html: TEXT.replace('Bhopal & Indore only', '<strong>Bhopal &amp; Indore only</strong>') }} />
      </div>
    </div>
  );
}
