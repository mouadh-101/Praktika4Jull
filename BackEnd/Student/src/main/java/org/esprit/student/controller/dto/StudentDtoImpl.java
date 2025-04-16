package org.esprit.student.controller.dto;

import org.esprit.student.controller.dto.ASIDto;
import org.esprit.student.entity.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public class StudentDtoImpl implements StudentDto {

    private Student student;

    public StudentDtoImpl(Student student) {
        this.student = student;
    }

    @Override
    public String getUserId() {
        return student.getUserId();
    }

    @Override
    public String getProfilePic() {
        return student.getProfilePic();
    }

    @Override
    public String getFieldOfStudy() {
        return student.getFieldOfStudy();
    }

    @Override
    public LocalDate getDateOfBirth() {
        return student.getDateOfBirth();
    }

    @Override
    public String getBio() {
        return student.getBio();
    }

    @Override
    public List<StudentDto.SkillDto> getSkills() {
        return student.getSkills().stream()
                .map(SkillDtoImpl::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentDto.EducationDto> getEducations() {
        return student.getEducations().stream()
                .map(EducationDtoImpl::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentDto.ExtraActivitiesDto> getExtraActivities() {
        return student.getExtraActivities().stream()
                .map(ExtraActivitiesDtoImpl::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentDto.WorkExperienceDto> getWorkExperiences() {
        return student.getWorkExperiences().stream()
                .map(WorkExperienceDtoImpl::new)
                .collect(Collectors.toList());
    }

    // Inner classes for sub-projections (you can put these in separate files if needed)

    public static class SkillDtoImpl implements StudentDto.SkillDto {
        private final Skill skill;

        public SkillDtoImpl(Skill skill) {
            this.skill = skill;
        }

        @Override
        public Long getId() {
            return skill.getId();
        }

        @Override
        public String getName() {
            return skill.getName();
        }
    }

    public static class EducationDtoImpl implements StudentDto.EducationDto {
        private final Education education;

        public EducationDtoImpl(Education education) {
            this.education = education;
        }

        @Override
        public Long getId() {
            return education.getId();
        }

        @Override
        public String getDegree() {
            return education.getDegree();
        }

        @Override
        public String getSchoolName() {
            return education.getSchoolName();
        }

        @Override
        public LocalDate getStartDate() {
            return education.getStartDate();
        }

        @Override
        public LocalDate getEndDate() {
            return education.getEndDate();
        }
    }

    public static class ExtraActivitiesDtoImpl implements StudentDto.ExtraActivitiesDto {
        private final ExtraActivities activity;

        public ExtraActivitiesDtoImpl(ExtraActivities activity) {
            this.activity = activity;
        }

        @Override
        public Long getId() {
            return activity.getId();
        }

        @Override
        public String getTitle() {
            return activity.getTitle();
        }

        @Override
        public String getDescription() {
            return activity.getDescription();
        }
    }

    public static class WorkExperienceDtoImpl implements StudentDto.WorkExperienceDto {
        private final WorkExperience experience;

        public WorkExperienceDtoImpl(WorkExperience experience) {
            this.experience = experience;
        }

        @Override
        public Long getId() {
            return experience.getId();
        }

        @Override
        public String getPosition() {
            return experience.getPosition();
        }

        @Override
        public String getCompanyName() {
            return experience.getCompanyName();
        }

        @Override
        public LocalDate getStartDate() {
            return experience.getStartDate();
        }

        @Override
        public LocalDate getEndDate() {
            return experience.getEndDate();
        }

        @Override
        public String getDescription() {
            return experience.getDescription();
        }
    }
}
