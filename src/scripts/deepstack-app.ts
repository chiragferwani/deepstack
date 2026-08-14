// Team Deepstack - Interactive Project Management & Team Dashboard Client Script

interface TeamMember {
  id: string;
  handle: string;
  name: string;
  role: string;
  image: string;
  avatarClass: string;
  initials: string;
  status: string;
  statusEmoji: string;
  statusCustom?: string;
  statusUpdatedAt: number;
}

interface ProjectUpdate {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

interface DocumentLink {
  id: string;
  title: string;
  url: string;
  type: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  taggedMembers: string[];
  updates: ProjectUpdate[];
  documents: DocumentLink[];
  createdAt: string;
}

interface AppState {
  currentView: 'home' | 'project' | 'team';
  activeProjectId: string | null;
  projects: Project[];
  teamMembers: TeamMember[];
}

const STORAGE_KEY = 'deepstack_app_data_v5';
const AUTH_KEY = 'deepstack_auth_session';

const STATUS_PRESETS: Array<{ label: string; emoji: string }> = [
  { label: 'Developing', emoji: '💻' },
  { label: 'Exhausted', emoji: '😫' },
  { label: 'Not Well', emoji: '🤒' },
  { label: 'Sleeping', emoji: '😴' },
  { label: 'Taking a Break', emoji: '☕' },
  { label: 'Deploying', emoji: '🚀' },
  { label: 'Code Review', emoji: '🔍' }
];

const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'chiragferwani',
    handle: '@chiragferwani',
    name: 'Chirag Ferwani',
    role: 'Full Stack & Cloud Architect',
    image: '/images/chiragferwani.png',
    avatarClass: 'avatar-chirag',
    initials: 'CF',
    status: 'Developing',
    statusEmoji: '💻',
    statusUpdatedAt: Date.now() - 1000 * 60 * 15
  },
  {
    id: 'anushkashinde',
    handle: '@anushkashinde',
    name: 'Anushka Shinde',
    role: 'Algorithms & AI Engineer',
    image: '/images/anushka.png',
    avatarClass: 'avatar-anushka',
    initials: 'AS',
    status: 'Exhausted',
    statusEmoji: '😫',
    statusUpdatedAt: Date.now() - 1000 * 60 * 90
  },
  {
    id: 'vrushabhhirap',
    handle: '@vrushabhhirap',
    name: 'Vrushabh Hirap',
    role: 'Hardware & Systems Lead',
    image: '/images/vrushabh.png',
    avatarClass: 'avatar-vrushabh',
    initials: 'VH',
    status: 'Developing',
    statusEmoji: '💻',
    statusUpdatedAt: Date.now() - 1000 * 60 * 25
  },
  {
    id: 'kshitijjadhav',
    handle: '@kshitijjadhav',
    name: 'Kshitij Jadhav',
    role: 'Firmware & Telemetry Engineer',
    image: '/images/kshitij.png',
    avatarClass: 'avatar-kshitij',
    initials: 'KJ',
    status: 'Sleeping',
    statusEmoji: '😴',
    statusUpdatedAt: Date.now() - 1000 * 60 * 240
  }
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Autonomous Navigation System',
    description: 'Real-time SLAM, sensor fusion (IMU + LiDAR), and path planning for autonomous obstacle avoidance.',
    category: 'Robotics & Control',
    progress: 75,
    taggedMembers: ['@vrushabhhirap', '@chiragferwani'],
    updates: [
      {
        id: 'upd-1',
        text: 'Integrated Extended Kalman Filter for IMU sensor fusion and odometry drift correction.',
        author: '@vrushabhhirap',
        timestamp: 'Today at 4:30 PM'
      },
      {
        id: 'upd-2',
        text: 'Configured ROS2 Nav2 action server with dynamic costmap layers for obstacle avoidance.',
        author: '@chiragferwani',
        timestamp: 'Yesterday at 7:15 PM'
      },
      {
        id: 'upd-3',
        text: 'Benchmarked waypoint latency under 12ms running on NVIDIA Jetson Orin.',
        author: '@vrushabhhirap',
        timestamp: '2 days ago'
      }
    ],
    documents: [
      {
        id: 'doc-1',
        title: 'ROS2 Navigation Architecture Spec',
        url: 'https://github.com/chiragferwani/deepstack',
        type: 'GitHub'
      },
      {
        id: 'doc-2',
        title: 'Hardware Circuit Schematics & Pinout',
        url: 'https://drive.google.com',
        type: 'Drive'
      }
    ],
    createdAt: '2026-08-10'
  },
  {
    id: 'proj-2',
    title: 'Computer Vision Object Detection Pipeline',
    description: 'High-speed object classification and bounding box localization for target identification in variable lighting.',
    category: 'Deep Learning',
    progress: 60,
    taggedMembers: ['@anushkashinde', '@chiragferwani'],
    updates: [
      {
        id: 'upd-4',
        text: 'Trained custom YOLOv8 model on 15,000 augmented domain images with 92.4% mAP50.',
        author: '@anushkashinde',
        timestamp: 'Today at 2:00 PM'
      },
      {
        id: 'upd-5',
        text: 'Optimized model with TensorRT FP16 quantization achieving 65 FPS on embedded hardware.',
        author: '@chiragferwani',
        timestamp: 'Yesterday at 9:40 PM'
      }
    ],
    documents: [
      {
        id: 'doc-3',
        title: 'Model Benchmark & Confusion Matrix',
        url: 'https://notion.so',
        type: 'Notion'
      },
      {
        id: 'doc-4',
        title: 'RoboFlow Annotated Dataset',
        url: 'https://roboflow.com',
        type: 'Docs'
      }
    ],
    createdAt: '2026-08-11'
  },
  {
    id: 'proj-3',
    title: 'Telemetry & Ground Station Dashboard',
    description: 'Unified command console displaying real-time vehicle telemetry, battery voltage, 3D attitude, and GPS coordinates.',
    category: 'Web & Systems',
    progress: 90,
    taggedMembers: ['@chiragferwani', '@kshitijjadhav'],
    updates: [
      {
        id: 'upd-6',
        text: 'Implemented zero-latency binary WebSocket telemetry stream operating at 100Hz.',
        author: '@chiragferwani',
        timestamp: 'Today at 11:15 AM'
      },
      {
        id: 'upd-7',
        text: 'Integrated interactive 3D WebGL orientation model and map waypoint plotting.',
        author: '@kshitijjadhav',
        timestamp: '3 days ago'
      }
    ],
    documents: [
      {
        id: 'doc-5',
        title: 'Ground Station UI Prototype',
        url: 'https://figma.com',
        type: 'Figma'
      },
      {
        id: 'doc-6',
        title: 'Telemetry Binary Protocol Buffers Schema',
        url: 'https://github.com',
        type: 'GitHub'
      }
    ],
    createdAt: '2026-08-12'
  }
];

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.projects) && Array.isArray(parsed.teamMembers)) {
        parsed.teamMembers = INITIAL_TEAM_MEMBERS.map((defaultMember) => {
          const existing = parsed.teamMembers.find((m: TeamMember) => m.id === defaultMember.id);
          return existing
            ? { ...existing, image: defaultMember.image }
            : defaultMember;
        });
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load deepstack state from localStorage', e);
  }

  return {
    currentView: 'home',
    activeProjectId: 'proj-1',
    projects: INITIAL_PROJECTS,
    teamMembers: INITIAL_TEAM_MEMBERS
  };
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save deepstack state', e);
  }
}

function isAuth(): boolean {
  try {
    return localStorage.getItem(AUTH_KEY) === 'authenticated';
  } catch {
    return false;
  }
}

function setAuth(authenticated: boolean) {
  try {
    if (authenticated) {
      localStorage.setItem(AUTH_KEY, 'authenticated');
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  } catch {}
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

class DeepstackApp {
  private state: AppState;
  private appRoot: HTMLElement | null = null;
  private loginRoot: HTMLElement | null = null;

  constructor() {
    this.state = loadState();
  }

  public init() {
    this.appRoot = document.getElementById('app-root');
    this.loginRoot = document.getElementById('login-root');

    this.bindLoginEvents();

    if (isAuth()) {
      this.showApp();
    } else {
      this.showLogin();
    }
  }

  private showLogin() {
    if (this.loginRoot) this.loginRoot.style.display = 'flex';
    if (this.appRoot) this.appRoot.style.display = 'none';

    this.renderSidebarPlaceholder();
  }

  private showApp() {
    if (this.loginRoot) this.loginRoot.style.display = 'none';
    if (this.appRoot) this.appRoot.style.display = 'block';

    this.render();
  }

  private bindLoginEvents() {
    const form = document.getElementById('login-form') as HTMLFormElement | null;
    const errorMsg = document.getElementById('login-error');

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const userIdInput = (document.getElementById('login-userid') as HTMLInputElement)?.value.trim();
      const passwordInput = (document.getElementById('login-password') as HTMLInputElement)?.value.trim();

      if (userIdInput === 'deepstack' && passwordInput === 'code@cvak') {
        errorMsg?.classList.remove('is-visible');
        setAuth(true);
        this.showApp();
      } else {
        errorMsg?.classList.add('is-visible');
      }
    });
  }

  private logout() {
    setAuth(false);
    this.showLogin();
  }

  private renderSidebarPlaceholder() {
    const existingSidebar = document.getElementById('site-sidebar');
    if (!existingSidebar) return;

    const teamListHtml = this.state.teamMembers
      .map(
        (member) => `
        <div class="login-team-member-item">
          <div class="login-team-member-avatar">
            <img src="${member.image}" alt="${escapeHtml(member.name)}" />
          </div>
          <div class="login-team-member-info">
            <span class="login-team-member-name">${escapeHtml(member.name)}</span>
            <span class="login-team-member-handle">${member.handle}</span>
          </div>
        </div>
      `
      )
      .join('');

    existingSidebar.innerHTML = `
      <div class="sidebar__brand-group">
        <div class="sidebar__brand-header">
          <a class="sidebar__title" href="/">
            <span class="sidebar__title-text">team - deepstack</span>
          </a>
          <img src="/deepstack.jpeg" alt="deepstack logo" class="sidebar__logo" />
        </div>
        <span class="sidebar__app-tag">College Workspace</span>
      </div>

      <div class="sidebar__quote">
        We don’t build stuff.<br />
        We convince it to exist.
      </div>

      <div class="sidebar__section-title" style="margin-top: 14px;">
        <span>Team Members</span>
      </div>

      <div class="sidebar__login-team-list">
        ${teamListHtml}
      </div>

      <div class="sidebar__user-bar">
        <span class="sidebar__user-pill">
          <span class="user-status-dot" style="background: var(--faint);"></span>
          Authentication Required
        </span>
      </div>
    `;
  }

  private renderSidebar() {
    const sidebar = document.getElementById('site-sidebar');
    if (!sidebar) return;

    const { currentView, activeProjectId, projects } = this.state;

    const isHomeActive = currentView === 'home';
    const isTeamActive = currentView === 'team';

    const projectItemsHtml = projects
      .map((proj) => {
        const isActive = currentView === 'project' && activeProjectId === proj.id;
        return `
          <li class="sidebar__nav-item">
            <button
              type="button"
              class="sidebar__nav-btn ${isActive ? 'is-active' : ''}"
              data-project-id="${proj.id}"
            >
              <span class="project-pill-badge">${proj.progress}%</span>
              <span>${escapeHtml(proj.title)}</span>
            </button>
          </li>
        `;
      })
      .join('');

    sidebar.innerHTML = `
      <div class="sidebar__brand-group">
        <div class="sidebar__brand-header">
          <a class="sidebar__title" href="/" id="btn-brand-home">
            <span class="sidebar__title-text">team - deepstack</span>
          </a>
          <img src="/deepstack.jpeg" alt="deepstack logo" class="sidebar__logo" />
        </div>
        <span class="sidebar__app-tag">College Workspace</span>
      </div>

      <div class="sidebar__quote">
        We don’t build stuff.<br />
        We convince it to exist.
      </div>

      <!-- Home Tab placed before Active Projects -->
      <div class="sidebar__section-title">
        <span>Navigation</span>
      </div>
      <ul class="sidebar__nav-list">
        <li class="sidebar__nav-item">
          <button
            type="button"
            class="sidebar__nav-btn ${isHomeActive ? 'is-active' : ''}"
            id="btn-nav-home"
          >
            <span class="project-pill-badge">${projects.length}</span>
            <span>🏠 Home</span>
          </button>
        </li>
      </ul>

      <div class="sidebar__section-title" style="margin-top: 20px;">
        <span>Active Projects (${projects.length})</span>
      </div>

      <ul class="sidebar__nav-list">
        ${projectItemsHtml}
      </ul>

      <button type="button" class="btn-add-project-sidebar" id="btn-open-add-project-modal">
        <span>＋ New Project</span>
      </button>

      <div class="sidebar__section-title" style="margin-top: 24px;">
        <span>Team</span>
      </div>
      <ul class="sidebar__nav-list">
        <li class="sidebar__nav-item">
          <button
            type="button"
            class="sidebar__nav-btn ${isTeamActive ? 'is-active' : ''}"
            id="btn-nav-team"
          >
            <span class="project-pill-badge">${this.state.teamMembers.length}</span>
            <span>👥 Team Overview</span>
          </button>
        </li>
      </ul>

      <div class="sidebar__user-bar">
        <span class="sidebar__user-pill">
          <span class="user-status-dot"></span>
          @deepstack
        </span>
        <button type="button" class="btn-logout" id="btn-sidebar-logout" title="Log out of session">
          <span>Sign Out</span>
        </button>
      </div>
    `;

    // Bind sidebar buttons
    document.getElementById('btn-nav-home')?.addEventListener('click', () => {
      this.state.currentView = 'home';
      saveState(this.state);
      this.render();
    });

    document.getElementById('btn-nav-team')?.addEventListener('click', () => {
      this.state.currentView = 'team';
      saveState(this.state);
      this.render();
    });

    document.querySelectorAll('[data-project-id]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const projId = (e.currentTarget as HTMLElement).dataset.projectId;
        if (projId) {
          this.state.currentView = 'project';
          this.state.activeProjectId = projId;
          saveState(this.state);
          this.render();
        }
      });
    });

    document.getElementById('btn-open-add-project-modal')?.addEventListener('click', () => {
      this.openAddProjectModal();
    });

    document.getElementById('btn-sidebar-logout')?.addEventListener('click', () => {
      this.logout();
    });
  }

  private render() {
    this.renderSidebar();

    if (!this.appRoot) return;

    if (this.state.currentView === 'home') {
      this.renderHomeView();
    } else if (this.state.currentView === 'team') {
      this.renderTeamView();
    } else {
      this.renderProjectView();
    }
  }

  private renderHomeView() {
    if (!this.appRoot) return;

    const { projects, teamMembers } = this.state;

    // Calculate metrics
    const totalProjects = projects.length;
    const avgProgress = totalProjects
      ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / totalProjects)
      : 0;
    const totalUpdates = projects.reduce((acc, p) => acc + p.updates.length, 0);

    const projectCardsHtml = projects
      .map((proj) => {
        // Find tagged members objects
        const assignedMembers = teamMembers.filter((m) => proj.taggedMembers.includes(m.handle));
        const membersAvatarsHtml = assignedMembers
          .map(
            (m) =>
              `<div class="overview-member-avatar" title="${m.name} (${m.handle})">
                <img src="${m.image}" alt="${m.name}" />
              </div>`
          )
          .join('');

        const latestUpdate = proj.updates[0];
        const statusLabel =
          proj.progress === 100
            ? 'Completed'
            : proj.progress >= 75
            ? 'Near Completion'
            : proj.progress >= 25
            ? 'In Progress'
            : 'Planning';

        return `
          <div class="overview-project-card" data-open-project="${proj.id}">
            <div class="overview-project-card__top">
              <div>
                <span class="overview-project-card__category">${escapeHtml(proj.category || 'Engineering')}</span>
                <h3 class="overview-project-card__title">${escapeHtml(proj.title)}</h3>
              </div>
              <span class="project-pill-badge">${statusLabel}</span>
            </div>

            <p class="overview-project-card__desc">${escapeHtml(proj.description)}</p>

            <div class="overview-project-card__progress-wrap">
              <div class="overview-project-card__progress-header">
                <span style="color: var(--muted); font-size: 11px; text-transform: uppercase;">Progress</span>
                <span style="font-weight: 700; color: var(--primary-accent);">${proj.progress}%</span>
              </div>
              <div class="progress-bar-track" style="height: 8px;">
                <div class="progress-bar-fill" style="width: ${proj.progress}%;"></div>
              </div>
            </div>

            ${
              latestUpdate
                ? `
                  <div style="font-size: 12px; color: var(--muted); background: var(--bg); padding: 8px 10px; border-radius: var(--radius-sm); border: 1px solid var(--border);">
                    <div style="display: flex; align-items: center; justify-content: space-between; font-family: var(--font-mono); font-size: 10px; color: var(--faint); margin-bottom: 2px;">
                      <span>Latest Update</span>
                      <span>${escapeHtml(latestUpdate.timestamp)}</span>
                    </div>
                    <span style="display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2; overflow: hidden;">${escapeHtml(latestUpdate.text)}</span>
                  </div>
                `
                : ''
            }

            <div class="overview-project-card__footer">
              <div class="overview-project-card__members">
                ${membersAvatarsHtml || '<span style="font-size: 11px; color: var(--faint);">No members tagged</span>'}
              </div>
              <span class="overview-open-btn">
                <span>Open Project</span>
                <span>→</span>
              </span>
            </div>
          </div>
        `;
      })
      .join('');

    this.appRoot.innerHTML = `
      <div class="home-view">
        <div class="home-header">
          <div class="home-header__top">
            <div>
              <h1 class="home-header__title">All Projects & Status</h1>
              <p class="home-header__desc">
                Centralized dashboard tracking multi-project progress, updates, and team ownership.
              </p>
            </div>
            <button type="button" class="btn-primary" id="btn-home-create-project">
              <span>＋ New Project</span>
            </button>
          </div>
        </div>

        <!-- Metrics Row -->
        <div class="metrics-row">
          <div class="metric-card">
            <span class="metric-card__label">Active Projects</span>
            <span class="metric-card__value">${totalProjects}</span>
          </div>
          <div class="metric-card">
            <span class="metric-card__label">Avg. Progress</span>
            <span class="metric-card__value">${avgProgress}%</span>
          </div>
          <div class="metric-card">
            <span class="metric-card__label">Total Milestones</span>
            <span class="metric-card__value">${totalUpdates}</span>
          </div>
        </div>

        <!-- Projects Grid -->
        <div class="overview-projects-grid">
          ${projectCardsHtml}
        </div>
      </div>
    `;

    document.getElementById('btn-home-create-project')?.addEventListener('click', () => {
      this.openAddProjectModal();
    });

    document.querySelectorAll('[data-open-project]').forEach((card) => {
      card.addEventListener('click', (e) => {
        const projId = (e.currentTarget as HTMLElement).dataset.openProject;
        if (projId) {
          this.state.currentView = 'project';
          this.state.activeProjectId = projId;
          saveState(this.state);
          this.render();
        }
      });
    });
  }

  private renderProjectView() {
    if (!this.appRoot) return;

    const project = this.state.projects.find((p) => p.id === this.state.activeProjectId) || this.state.projects[0];

    if (!project) {
      this.state.currentView = 'home';
      this.render();
      return;
    }

    const { teamMembers } = this.state;

    // Build Tagged Members HTML with profile images
    const memberTagsHtml = teamMembers
      .map((member) => {
        const isTagged = project.taggedMembers.includes(member.handle);
        return `
          <button
            type="button"
            class="member-tag-chip ${isTagged ? 'is-tagged' : ''}"
            data-toggle-tag="${member.handle}"
            title="${isTagged ? 'Click to remove tag' : 'Click to tag on this project'}"
          >
            <span class="member-tag-chip__avatar">
              <img src="${member.image}" alt="${escapeHtml(member.name)}" />
            </span>
            <span>${member.name}</span>
            <span style="font-size: 11px; opacity: 0.7;">${member.handle}</span>
          </button>
        `;
      })
      .join('');

    // Build Updates HTML with author profile images
    const updatesHtml = project.updates.length
      ? project.updates
          .map((upd) => {
            const authorMember = teamMembers.find((m) => m.handle === upd.author);
            const authorImg = authorMember ? authorMember.image : '/deepstack.jpeg';
            const authorName = authorMember ? authorMember.name : upd.author;

            return `
              <div class="update-item" data-update-id="${upd.id}">
                <div class="update-item__avatar">
                  <img src="${authorImg}" alt="${escapeHtml(authorName)}" />
                </div>
                <div class="update-item__body">
                  <div class="update-item__meta">
                    <span class="update-item__author">${escapeHtml(authorName)} <span style="font-weight: 400; opacity: 0.8; font-size: 11px;">(${escapeHtml(upd.author)})</span></span>
                    <span>•</span>
                    <span>${escapeHtml(upd.timestamp)}</span>
                  </div>
                  <p class="update-item__text">${escapeHtml(upd.text)}</p>
                </div>
                <button
                  type="button"
                  class="btn-delete-item"
                  data-delete-update="${upd.id}"
                  title="Delete update"
                >
                  ✕
                </button>
              </div>
            `;
          })
          .join('')
      : `
        <div class="empty-state" style="padding: 24px;">
          <p class="empty-state__text">No project updates posted yet. Add the first update below!</p>
        </div>
      `;

    // Build Documents HTML
    const docsHtml = project.documents.length
      ? project.documents
          .map(
            (doc) => `
          <div class="doc-card">
            <div class="doc-card__info">
              <div class="doc-card__icon-badge">🔗</div>
              <div class="doc-card__texts">
                <a href="${escapeHtml(doc.url)}" target="_blank" rel="noopener noreferrer" class="doc-card__title">
                  ${escapeHtml(doc.title)}
                </a>
                <span class="doc-card__url">${escapeHtml(doc.url)}</span>
              </div>
            </div>
            <div class="doc-card__actions">
              <a href="${escapeHtml(doc.url)}" target="_blank" rel="noopener noreferrer" class="btn-open-doc" title="Open Link">
                Open ↗
              </a>
              <button
                type="button"
                class="btn-delete-item"
                data-delete-doc="${doc.id}"
                title="Remove document link"
              >
                ✕
              </button>
            </div>
          </div>
        `
          )
          .join('')
      : `
        <div class="empty-state" style="padding: 24px; grid-column: 1 / -1;">
          <p class="empty-state__text">No shared document links yet. Add your specs, repos, or design links below!</p>
        </div>
      `;

    // Enhanced Author Options for New Update Form
    const defaultAuthor = teamMembers[2] || teamMembers[0]; // Chirag Ferwani default
    const authorOptionsHtml = teamMembers
      .map(
        (m) =>
          `<option value="${m.handle}" data-avatar="${m.image}" ${m.id === defaultAuthor.id ? 'selected' : ''}>${m.name} (${m.handle})</option>`
      )
      .join('');

    this.appRoot.innerHTML = `
      <div class="project-view">
        <!-- Project Header -->
        <div class="project-header">
          <div class="project-header__top">
            <div class="project-header__title-group">
              <span class="project-header__category">${escapeHtml(project.category || 'General')}</span>
              <h1 class="project-header__title">${escapeHtml(project.title)}</h1>
              <p class="project-header__desc">${escapeHtml(project.description)}</p>
            </div>
            <div class="project-header__actions">
              <button type="button" class="btn-danger-outline" id="btn-delete-project">
                <span>Delete Project</span>
              </button>
            </div>
          </div>

          <!-- Tagged Team Members -->
          <div class="tagged-members-box">
            <div class="tagged-members-box__header">
              <span class="tagged-members-box__title">Assigned Team Members (${project.taggedMembers.length})</span>
              <span style="font-size: 11px; color: var(--faint);">Click to tag / untag</span>
            </div>
            <div class="tagged-members-list">
              ${memberTagsHtml}
            </div>
          </div>
        </div>

        <!-- Progress Card -->
        <div class="progress-card">
          <div class="progress-card__header">
            <h2 class="progress-card__title">
              <span>Overall Progress</span>
            </h2>
            <div class="progress-card__percentage" id="progress-text-display">
              ${project.progress}%
            </div>
          </div>

          <div class="progress-bar-track">
            <div
              class="progress-bar-fill"
              id="progress-fill-bar"
              style="width: ${project.progress}%;"
            ></div>
          </div>

          <div class="progress-controls">
            <div class="progress-slider-row">
              <span style="font-size: 12px; font-family: var(--font-mono); color: var(--faint);">0%</span>
              <input
                type="range"
                id="project-progress-slider"
                class="progress-slider"
                min="0"
                max="100"
                value="${project.progress}"
              />
              <span style="font-size: 12px; font-family: var(--font-mono); color: var(--faint);">100%</span>
            </div>

            <div class="progress-quick-btns">
              <span style="font-size: 12px; color: var(--muted); margin-right: 4px;">Quick Set:</span>
              <button type="button" class="btn-quick-progress" data-set-progress="0">0%</button>
              <button type="button" class="btn-quick-progress" data-set-progress="25">25%</button>
              <button type="button" class="btn-quick-progress" data-set-progress="50">50%</button>
              <button type="button" class="btn-quick-progress" data-set-progress="75">75%</button>
              <button type="button" class="btn-quick-progress" data-set-progress="100">100%</button>
              <button type="button" class="btn-quick-progress" data-delta-progress="-5">-5%</button>
              <button type="button" class="btn-quick-progress" data-delta-progress="5">+5%</button>
            </div>
          </div>
        </div>

        <!-- Project Updates Points Section -->
        <div class="section-block">
          <div class="section-block__header">
            <h2 class="section-block__title">
              <span>Project Updates & Milestones</span>
            </h2>
            <span class="section-block__count">${project.updates.length} updates</span>
          </div>

          <div class="updates-list">
            ${updatesHtml}
          </div>

          <!-- Add Update Form with Enhanced Author Selector -->
          <div class="add-update-box">
            <div class="enhanced-author-container">
              <span class="enhanced-author-label">Author:</span>
              <div class="enhanced-author-selector">
                <div class="author-preview-avatar" id="author-avatar-preview">
                  <img src="${defaultAuthor.image}" alt="${defaultAuthor.name}" />
                </div>
                <select id="update-author" class="author-select-enhanced">
                  ${authorOptionsHtml}
                </select>
              </div>
            </div>

            <textarea
              id="update-text-input"
              class="form-textarea add-update-textarea"
              placeholder="Write a progress point, milestone achieved, or next step for the team..."
            ></textarea>

            <div style="display: flex; justify-content: flex-end;">
              <button type="button" class="btn-primary" id="btn-post-update">
                <span>Post Update Point</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Document Links Section -->
        <div class="section-block">
          <div class="section-block__header">
            <h2 class="section-block__title">
              <span>Shared Documents & Resources</span>
            </h2>
            <span class="section-block__count">${project.documents.length} links</span>
          </div>

          <div class="docs-grid">
            ${docsHtml}
          </div>

          <!-- Add Document Link Form -->
          <div class="add-doc-box">
            <span style="font-size: 13px; font-weight: 600; color: var(--muted);">Share Document / Resource</span>
            <div class="add-doc-row">
              <input
                type="text"
                id="doc-title-input"
                class="form-input"
                placeholder="Title (e.g. Design Prototype)"
              />
              <input
                type="url"
                id="doc-url-input"
                class="form-input"
                placeholder="https://..."
              />
              <button type="button" class="btn-primary" id="btn-add-doc">
                <span>Add Link</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind Interactive Events for Project View
    this.bindProjectViewEvents(project);
  }

  private bindProjectViewEvents(project: Project) {
    // Delete project
    document.getElementById('btn-delete-project')?.addEventListener('click', () => {
      if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
        this.state.projects = this.state.projects.filter((p) => p.id !== project.id);
        this.state.currentView = 'home';
        this.state.activeProjectId = this.state.projects[0]?.id || null;
        saveState(this.state);
        this.render();
      }
    });

    // Toggle Tagged Members
    document.querySelectorAll('[data-toggle-tag]').forEach((chip) => {
      chip.addEventListener('click', (e) => {
        const handle = (e.currentTarget as HTMLElement).dataset.toggleTag;
        if (!handle) return;

        if (project.taggedMembers.includes(handle)) {
          project.taggedMembers = project.taggedMembers.filter((h) => h !== handle);
        } else {
          project.taggedMembers.push(handle);
        }
        saveState(this.state);
        this.render();
      });
    });

    // Enhanced author dropdown avatar preview change
    const authorSelect = document.getElementById('update-author') as HTMLSelectElement | null;
    const authorPreviewAvatar = document.getElementById('author-avatar-preview');

    authorSelect?.addEventListener('change', () => {
      const selectedOption = authorSelect.options[authorSelect.selectedIndex];
      const avatarUrl = selectedOption.getAttribute('data-avatar');
      if (authorPreviewAvatar && avatarUrl) {
        authorPreviewAvatar.innerHTML = `<img src="${avatarUrl}" alt="Author" />`;
      }
    });

    // Progress slider
    const slider = document.getElementById('project-progress-slider') as HTMLInputElement | null;
    const progressDisplay = document.getElementById('progress-text-display');
    const fillBar = document.getElementById('progress-fill-bar');

    const updateProgressVal = (newVal: number) => {
      const clamped = Math.max(0, Math.min(100, Math.round(newVal)));
      project.progress = clamped;
      if (slider) slider.value = String(clamped);
      if (progressDisplay) progressDisplay.textContent = `${clamped}%`;
      if (fillBar) fillBar.style.width = `${clamped}%`;
      saveState(this.state);
      this.renderSidebar();
    };

    slider?.addEventListener('input', (e) => {
      const val = parseInt((e.target as HTMLInputElement).value, 10);
      updateProgressVal(val);
    });

    // Quick set buttons
    document.querySelectorAll('[data-set-progress]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const val = parseInt((e.currentTarget as HTMLElement).dataset.setProgress || '0', 10);
        updateProgressVal(val);
      });
    });

    // Delta buttons
    document.querySelectorAll('[data-delta-progress]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const delta = parseInt((e.currentTarget as HTMLElement).dataset.deltaProgress || '0', 10);
        updateProgressVal(project.progress + delta);
      });
    });

    // Add update
    document.getElementById('btn-post-update')?.addEventListener('click', () => {
      const author = authorSelect?.value || '@chiragferwani';
      const textInput = document.getElementById('update-text-input') as HTMLTextAreaElement | null;
      const text = textInput?.value.trim() || '';

      if (!text) {
        alert('Please write an update note before posting.');
        return;
      }

      project.updates.unshift({
        id: `upd-${Date.now()}`,
        text,
        author,
        timestamp: 'Just now'
      });

      saveState(this.state);
      this.render();
    });

    // Delete update
    document.querySelectorAll('[data-delete-update]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const updId = (e.currentTarget as HTMLElement).dataset.deleteUpdate;
        if (updId) {
          project.updates = project.updates.filter((u) => u.id !== updId);
          saveState(this.state);
          this.render();
        }
      });
    });

    // Add Document Link
    document.getElementById('btn-add-doc')?.addEventListener('click', () => {
      const titleInput = document.getElementById('doc-title-input') as HTMLInputElement | null;
      const urlInput = document.getElementById('doc-url-input') as HTMLInputElement | null;

      const title = titleInput?.value.trim() || '';
      let url = urlInput?.value.trim() || '';

      if (!title) {
        alert('Please enter a document title.');
        return;
      }
      if (!url) {
        alert('Please enter a valid URL.');
        return;
      }

      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }

      project.documents.push({
        id: `doc-${Date.now()}`,
        title,
        url,
        type: 'Doc'
      });

      saveState(this.state);
      this.render();
    });

    // Delete Document Link
    document.querySelectorAll('[data-delete-doc]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const docId = (e.currentTarget as HTMLElement).dataset.deleteDoc;
        if (docId) {
          project.documents = project.documents.filter((d) => d.id !== docId);
          saveState(this.state);
          this.render();
        }
      });
    });
  }

  private renderTeamView() {
    if (!this.appRoot) return;

    const { teamMembers, projects } = this.state;

    const teamCardsHtml = teamMembers
      .map((member) => {
        // Find projects this member is tagged in
        const assignedProjects = projects.filter((p) => p.taggedMembers.includes(member.handle));
        const assignedProjectsHtml = assignedProjects.length
          ? assignedProjects
              .map(
                (p) =>
                  `<button type="button" class="member-project-badge" data-jump-project="${p.id}">${escapeHtml(p.title)} (${p.progress}%)</button>`
              )
              .join('')
          : `<span style="font-size: 12px; color: var(--faint);">No active project tags</span>`;

        // Preset status pills
        const statusPillsHtml = STATUS_PRESETS.map((preset) => {
          const isActive = member.status === preset.label;
          return `
            <button
              type="button"
              class="status-pill-btn ${isActive ? 'is-active' : ''}"
              data-member-id="${member.id}"
              data-status-label="${preset.label}"
              data-status-emoji="${preset.emoji}"
            >
              <span>${preset.emoji}</span>
              <span>${preset.label}</span>
            </button>
          `;
        }).join('');

        return `
          <div class="team-member-card">
            <div class="team-member-card__top">
              <div class="team-member-card__avatar">
                <img src="${member.image}" alt="${escapeHtml(member.name)}" />
              </div>
              <div class="team-member-card__info">
                <h3 class="team-member-card__name">${escapeHtml(member.name)}</h3>
                <span class="team-member-card__handle">${member.handle}</span>
                <span class="team-member-card__role">${escapeHtml(member.role)}</span>
              </div>
            </div>

            <!-- Current Status -->
            <div class="status-badge-container">
              <div class="status-badge-container__top">
                <span class="status-label-heading">Current Status</span>
                <span class="status-time">Updated ${formatRelativeTime(member.statusUpdatedAt)}</span>
              </div>
              <div class="status-display">
                <span class="status-emoji-icon">${member.statusEmoji}</span>
                <span>${escapeHtml(member.status)}</span>
              </div>
            </div>

            <!-- Quick Status Update -->
            <div class="status-select-container">
              <span class="status-label-heading">Quick Status Update</span>
              <div class="status-quick-pills">
                ${statusPillsHtml}
              </div>
              <div style="display: flex; gap: 6px; margin-top: 6px;">
                <input
                  type="text"
                  class="form-input"
                  style="padding: 4px 8px; font-size: 12px; flex: 1;"
                  placeholder="Custom status (e.g. Debugging CAN bus)..."
                  data-custom-status-input="${member.id}"
                />
                <button
                  type="button"
                  class="btn-primary"
                  style="padding: 4px 10px; font-size: 12px;"
                  data-custom-status-btn="${member.id}"
                >
                  Set
                </button>
              </div>
            </div>

            <!-- Assigned Projects -->
            <div class="member-assigned-projects">
              <span class="member-assigned-projects__title">Tagged Projects (${assignedProjects.length})</span>
              <div class="member-project-tags">
                ${assignedProjectsHtml}
              </div>
            </div>
          </div>
        `;
      })
      .join('');

    this.appRoot.innerHTML = `
      <div class="team-view">
        <div class="team-header">
          <h1 class="team-header__title">Team Deepstack</h1>
          <p class="team-header__desc">
            College Engineering Team Members & Real-time Live Status Tracker.
          </p>
        </div>

        <div class="team-cards-grid">
          ${teamCardsHtml}
        </div>
      </div>
    `;

    // Bind Status Change Buttons
    document.querySelectorAll('[data-status-label]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const memberId = target.dataset.memberId;
        const statusLabel = target.dataset.statusLabel;
        const statusEmoji = target.dataset.statusEmoji;

        if (memberId && statusLabel && statusEmoji) {
          const member = this.state.teamMembers.find((m) => m.id === memberId);
          if (member) {
            member.status = statusLabel;
            member.statusEmoji = statusEmoji;
            member.statusUpdatedAt = Date.now();
            saveState(this.state);
            this.render();
          }
        }
      });
    });

    // Custom status set
    document.querySelectorAll('[data-custom-status-btn]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const memberId = (e.currentTarget as HTMLElement).dataset.customStatusBtn;
        const input = document.querySelector(`[data-custom-status-input="${memberId}"]`) as HTMLInputElement | null;
        const customText = input?.value.trim();

        if (memberId && customText) {
          const member = this.state.teamMembers.find((m) => m.id === memberId);
          if (member) {
            member.status = customText;
            member.statusEmoji = '⚡';
            member.statusUpdatedAt = Date.now();
            saveState(this.state);
            this.render();
          }
        }
      });
    });

    // Jump to project from member card
    document.querySelectorAll('[data-jump-project]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const projId = (e.currentTarget as HTMLElement).dataset.jumpProject;
        if (projId) {
          this.state.currentView = 'project';
          this.state.activeProjectId = projId;
          saveState(this.state);
          this.render();
        }
      });
    });
  }

  private openAddProjectModal() {
    const existingModal = document.getElementById('add-project-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'add-project-modal';
    modal.className = 'modal-backdrop';

    const memberCheckboxesHtml = this.state.teamMembers
      .map(
        (m) => `
        <label style="display: inline-flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;">
          <input type="checkbox" name="modal-tagged" value="${m.handle}" />
          <img src="${m.image}" alt="${m.name}" style="width: 20px; height: 20px; border-radius: 50%; object-fit: cover;" />
          <span>${m.name} (${m.handle})</span>
        </label>
      `
      )
      .join('');

    modal.innerHTML = `
      <div class="modal-box">
        <div class="modal-header">
          <h2 class="modal-title">Create New Project</h2>
          <button type="button" class="modal-close-btn" id="btn-close-modal">✕</button>
        </div>

        <form id="new-project-form" style="display: flex; flex-direction: column; gap: 14px;">
          <div class="form-group">
            <label class="form-label" for="new-proj-title">Project Title *</label>
            <input
              type="text"
              id="new-proj-title"
              class="form-input"
              placeholder="e.g. Autonomous Drone Swarm Controller"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="new-proj-category">Category / Domain</label>
            <input
              type="text"
              id="new-proj-category"
              class="form-input"
              placeholder="e.g. Robotics, AI, Embedded, Web"
              value="Engineering"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="new-proj-desc">Description</label>
            <textarea
              id="new-proj-desc"
              class="form-textarea"
              placeholder="Brief overview of project scope, objectives, and deliverables..."
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Initial Progress %</label>
            <input
              type="number"
              id="new-proj-progress"
              class="form-input"
              min="0"
              max="100"
              value="0"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Assign Team Members</label>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${memberCheckboxesHtml}
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-secondary" id="btn-cancel-modal">Cancel</button>
            <button type="submit" class="btn-primary">Create Project</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => modal.remove();

    document.getElementById('btn-close-modal')?.addEventListener('click', closeModal);
    document.getElementById('btn-cancel-modal')?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.getElementById('new-project-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = (document.getElementById('new-proj-title') as HTMLInputElement)?.value.trim();
      const category = (document.getElementById('new-proj-category') as HTMLInputElement)?.value.trim() || 'General';
      const description = (document.getElementById('new-proj-desc') as HTMLTextAreaElement)?.value.trim() || '';
      const progress = parseInt((document.getElementById('new-proj-progress') as HTMLInputElement)?.value || '0', 10);

      const checkedMembers: string[] = [];
      document.querySelectorAll<HTMLInputElement>('input[name="modal-tagged"]:checked').forEach((chk) => {
        checkedMembers.push(chk.value);
      });

      if (!title) {
        alert('Please enter a project title.');
        return;
      }

      const newProjId = `proj-${Date.now()}`;
      const newProj: Project = {
        id: newProjId,
        title,
        category,
        description,
        progress: Math.max(0, Math.min(100, progress)),
        taggedMembers: checkedMembers,
        updates: [
          {
            id: `upd-${Date.now()}`,
            text: `Project "${title}" initialized.`,
            author: checkedMembers[0] || '@chiragferwani',
            timestamp: 'Just now'
          }
        ],
        documents: [],
        createdAt: new Date().toISOString().split('T')[0]
      };

      this.state.projects.unshift(newProj);
      this.state.currentView = 'project';
      this.state.activeProjectId = newProjId;
      saveState(this.state);
      closeModal();
      this.render();
    });
  }
}

// Initialize on DOM ready
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const app = new DeepstackApp();
    app.init();
  });
}
