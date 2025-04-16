package org.esprit.student.service.Implementation;


import lombok.extern.slf4j.Slf4j;
import org.esprit.student.controller.dto.CourseDto;
import org.esprit.student.controller.dto.SkillStudentCountDTO;
import org.esprit.student.entity.Skill;
import org.esprit.student.entity.Student;
import org.esprit.student.repository.SkillRepository;
import org.esprit.student.repository.StudentRepository;
import org.esprit.student.service.Interface.ISkillService;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.jsoup.nodes.Element;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;


@Service
@Slf4j
public class SkillService implements ISkillService {
    @Autowired
    SkillRepository skillRepository;
    @Autowired
    StudentRepository studentRepository;
    private final String STARTPAGE_SEARCH_URL = "https://www.startpage.com/sp/search?query=site:udemy.com+";
    @Override
    public Skill addSkill(Skill skill,String userId) {
        if(skillRepository.existsByName(skill.getName()))
        {
            Student s =studentRepository.findById(userId).orElse(null);
            Skill skillE=skillRepository.findByName(skill.getName());
            skillE.getStudents().add(s);
            s.getSkills().add(skillE);
            return skillRepository.save(skillE);
        }
        else {
            if (studentRepository.existsById(userId)) {
                skill.setStudents(new ArrayList<>());
                Student s = studentRepository.findById(userId).orElse(null);
                skill.getStudents().add(s);
                s.getSkills().add(skill);

                return skillRepository.save(skill);
            }
        }
        return null;
    }

    @Override
    public Skill updateSkill(Long id,Skill skill) {
        Skill existingSkill = skillRepository.findById(id).orElse(null);
        if(existingSkill!=null) {
            existingSkill.setName(skill.getName());
            return skillRepository.save(existingSkill);
        }
        return null;
    }

    @Override
    public void deleteSkill(Long id) {
        skillRepository.delete(skillRepository.findById(id).orElse(null));
    }

    @Override
    public Skill getSkill(Long id) {
        return skillRepository.findById(id).orElse(null);
    }

    @Override
    public Skill affecterSkill(Long id, String idS) {
        Skill s=skillRepository.findById(id).orElse(null);
        if(s!=null)
        {
            s.getStudents().add(studentRepository.findById(idS).orElse(null));
            studentRepository.findById(idS).orElse(null).getSkills().add(s);
            return skillRepository.save(s);
        }
        return null;
    }

    @Override
    public Skill disAffecterSkill(Long id, String idS) {
        Skill s=skillRepository.findById(id).orElse(null);
        if(s!=null)
        {
            s.getStudents().remove(studentRepository.findById(idS).orElse(null));
            studentRepository.findById(idS).orElse(null).getSkills().remove(s);
            System.out.println(s.toString());
            return skillRepository.save(s);
        }
        return null;
    }

    @Override
    public List<Skill> find10Skill(String id) {
        return skillRepository.findTop10UnassignedSkills(id);
    }
    @Override
    public List<CourseDto> searchUdemyCourses(String userId) {
        List<CourseDto> courses = new ArrayList<>();
        List<Skill> skills = skillRepository.findSkillsByUserId(userId);

        System.out.println("Fetching skills for user: " + userId);
        System.out.println("Skills found: " + skills.size());

        for (Skill skill : skills) {
            String searchQuery = STARTPAGE_SEARCH_URL + skill.getName().replace(" ", "+");
            System.out.println("Searching for: " + skill.getName());
            System.out.println("Search URL: " + searchQuery);

            try {
                // Rotate User-Agents to avoid bot detection
                String[] userAgents = {
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124",
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/90.0.4430.212",
                        "Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 Chrome/88.0.4324.181"
                };
                Random random = new Random();
                String userAgent = userAgents[random.nextInt(userAgents.length)];

                Document doc = Jsoup.connect(searchQuery)
                        .userAgent(userAgent)
                        .timeout(5000)
                        .get();

                // Select all search results
                Elements results = doc.select(".result-title");

                System.out.println("Number of results found: " + results.size());

                for (Element result : results) {
                    String link = result.absUrl("href").trim(); // Get absolute URL
                    String title = result.text().trim();

                    System.out.println("Raw link found: " + link);
                    System.out.println("Title found: " + title);

                    // Check if the link is a valid Udemy course
                    if (link.matches(".*udemy\\.com/course/[^\\s]+")) {
                        System.out.println("✅ Valid Udemy course added: " + title);
                        courses.add(new CourseDto(title, link));
                    } else {
                        System.out.println("❌ Ignored non-Udemy course: " + title);
                    }
                }
            } catch (IOException e) {
                System.out.println("❌ Error fetching search results for " + skill.getName());
                e.printStackTrace();
            }
        }

        System.out.println("Total valid courses found: " + courses.size());
        return courses;
    }

    @Override
    public List<SkillStudentCountDTO> getStudentCountPerSkill()  {
        return skillRepository.countStudentsPerSkill();
    }

}
