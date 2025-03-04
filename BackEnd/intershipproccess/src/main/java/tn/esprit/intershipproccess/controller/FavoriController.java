package tn.esprit.intershipproccess.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.intershipproccess.entity.Company;
import tn.esprit.intershipproccess.entity.Favoris;
import tn.esprit.intershipproccess.entity.Internship;
import tn.esprit.intershipproccess.service.CompanyService;
import tn.esprit.intershipproccess.service.FavoriService;

import java.util.List;

@RestController
@RequestMapping("/api/internships/favori")
@Slf4j
public class FavoriController {
    @Autowired
    private FavoriService favoriService;
    @PostMapping("/addFavori/{idInternship}")
    public ResponseEntity<?> addFavoris(@RequestBody Favoris favoris,@PathVariable("idInternship") int idInternship,@RequestHeader("userId") String userId){
        Favoris savedFavoris = favoriService.addFavoris(favoris,idInternship,userId);
        return new ResponseEntity<>(savedFavoris, HttpStatus.CREATED);
    }
    @DeleteMapping("/removeFavori/{idInternship}")
    public ResponseEntity<?> removeFavori(@PathVariable("idInternship") int idInternship, @RequestHeader("userId") String userId){
        boolean isRemoved = favoriService.removeFavori(idInternship, userId);
        if (isRemoved) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);  // No content to return, just indicate successful deletion
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);  // If the favorite is not found
        }
    }


    @GetMapping("/checkFavori/{idInternship}/{userId}")
    public ResponseEntity<Boolean> checkFavori(@PathVariable("idInternship") int idInternship, @PathVariable("userId") String userId) {
        boolean exists = favoriService.checkFavori(idInternship, userId);
        return new ResponseEntity<>(exists, HttpStatus.OK);
    }
    @GetMapping("/favorisByUser/{userId}")
    public ResponseEntity<List<Internship>> getInternshipsByUserId(@PathVariable("userId") String userId) {
        List<Internship> internships = favoriService.findInternshipsByUserId(userId);
        return ResponseEntity.ok(internships);
    }


}
