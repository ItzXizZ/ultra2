import { Model, DataTypes, Sequelize } from 'sequelize';

export class OpportunitySubmission extends Model {
  public id!: number;
  public source!: string; // ultra, general, funding, job, founder
  public title!: string;
  public description!: string;
  public company?: string;
  public location?: string;
  public type?: string;
  public application_deadline?: string;
  public gpa_requirement?: string;
  public skills?: string;
  public grade_levels?: string;
  public compensation?: string;
  public file_attachment?: string;
  public status!: string; // pending, approved, rejected
  public feedback?: string;
  public created_at!: Date;
  public updated_at!: Date;
  public priority!: boolean;
  public badge?: string;
  
  // Submitter information
  public submitter_role?: string;
  public submitter_name?: string;
  public submitter_email?: string;
  public submitter_phone?: string;
  
  // Company information
  public company_website?: string;
  public company_size?: string;
  public industry?: string;
  public company_location?: string;
  
  // Application information
  public application_link?: string;
  public application_method?: string;
  public application_instructions?: string;
  
  // Admin fields
  public reviewed_by?: number;
  public reviewed_at?: Date;
  public admin_notes?: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public toJSON(): any {
    const values = Object.assign({}, this.get());
    return {
      ...values,
      created_at: values.created_at?.toISOString(),
      updated_at: values.updated_at?.toISOString(),
      reviewed_at: values.reviewed_at?.toISOString()
    };
  }
}

export function initializeOpportunitySubmission(sequelize: Sequelize): void {
  OpportunitySubmission.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      source: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      company: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      application_deadline: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      gpa_requirement: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      skills: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      grade_levels: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      compensation: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      file_attachment: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'pending',
      },
      feedback: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      priority: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      badge: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      submitter_role: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      submitter_name: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      submitter_email: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      submitter_phone: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      company_website: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      company_size: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      industry: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      company_location: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      application_link: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      application_method: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      application_instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      reviewed_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      reviewed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      admin_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'opportunity_submissions',
      timestamps: true,
      underscored: true,
    }
  );
} 